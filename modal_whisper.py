"""
Modal deployment for Tarteel's Quran-trained Whisper model.
Provides server-side Arabic Quran transcription with GPU acceleration.

Key optimization: Model weights are baked into the image to eliminate
cold-start download time (30-60s → ~10s).

Deploy: cd /Users/admin/clawd && source .venv/bin/activate && cd projects/quran-oasis && modal deploy modal_whisper.py
Test:   modal run modal_whisper.py
"""

import modal
import io
import base64

app = modal.App("hifz-whisper")

# Bake model weights into the image at build time
# This eliminates HuggingFace downloads on cold start
def download_model():
    from transformers import WhisperProcessor, WhisperForConditionalGeneration
    model_name = "tarteel-ai/whisper-base-ar-quran"
    WhisperProcessor.from_pretrained(model_name)
    WhisperForConditionalGeneration.from_pretrained(model_name)

whisper_image = (
    modal.Image.debian_slim(python_version="3.11")
    .apt_install("ffmpeg")  # For audio format conversion
    .pip_install(
        "transformers>=4.36.0",
        "torch>=2.1.0",
        "torchaudio>=2.1.0",
        "librosa>=0.10.0",
        "soundfile>=0.12.0",
        "accelerate>=0.25.0",
        "numpy<2.0",
        "fastapi[standard]",
        "pydub>=0.25.0",  # For webm/opus handling
    )
    .run_function(download_model)  # Bake model into image
)


@app.cls(
    gpu="T4",
    image=whisper_image,
    scaledown_window=300,
    timeout=120,
)
class QuranWhisper:
    @modal.enter()
    def load_model(self):
        import torch
        from transformers import WhisperProcessor, WhisperForConditionalGeneration

        model_name = "tarteel-ai/whisper-base-ar-quran"
        self.processor = WhisperProcessor.from_pretrained(model_name)
        self.model = WhisperForConditionalGeneration.from_pretrained(model_name)
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model.to(self.device)
        self.model.eval()
        print(f"Model loaded on {self.device}")

    @modal.method()
    def transcribe(self, audio_bytes: bytes) -> dict:
        import torch
        import librosa
        import numpy as np
        import soundfile as sf
        import subprocess
        import tempfile
        import os

        try:
            audio_buffer = io.BytesIO(audio_bytes)

            # Try to detect format and convert webm/opus to wav via ffmpeg
            audio = None
            sr = None

            try:
                audio, sr = sf.read(audio_buffer)
            except Exception:
                audio_buffer.seek(0)
                try:
                    audio, sr = librosa.load(audio_buffer, sr=None)
                except Exception:
                    # Last resort: use ffmpeg to convert from webm/opus
                    with tempfile.NamedTemporaryFile(suffix='.webm', delete=False) as tmp_in:
                        tmp_in.write(audio_bytes)
                        tmp_in_path = tmp_in.name
                    tmp_out_path = tmp_in_path.replace('.webm', '.wav')
                    try:
                        subprocess.run(
                            ['ffmpeg', '-y', '-i', tmp_in_path, '-ar', '16000', '-ac', '1', '-f', 'wav', tmp_out_path],
                            capture_output=True, timeout=10
                        )
                        audio, sr = sf.read(tmp_out_path)
                    finally:
                        for p in [tmp_in_path, tmp_out_path]:
                            if os.path.exists(p):
                                os.unlink(p)

            if audio is None:
                return {"success": False, "text": "", "error": "Could not decode audio"}

            if len(audio.shape) > 1:
                audio = np.mean(audio, axis=1)
            if sr != 16000:
                audio = librosa.resample(audio, orig_sr=sr, target_sr=16000)
            audio = audio.astype(np.float32)

            # Validate audio has content
            if len(audio) < 1600:  # Less than 0.1s
                return {"success": False, "text": "", "error": "Audio too short"}

            inputs = self.processor(audio, sampling_rate=16000, return_tensors="pt")
            input_features = inputs.input_features.to(self.device)

            with torch.no_grad():
                generated_ids = self.model.generate(input_features, max_length=448)

            transcription = self.processor.batch_decode(generated_ids, skip_special_tokens=True)[0]

            import re
            transcription = re.sub(r'<\|[^|]+\|>', '', transcription).strip()

            return {
                "success": True,
                "text": transcription,
                "duration_seconds": len(audio) / 16000,
            }

        except Exception as e:
            return {"success": False, "text": "", "error": str(e)}


# Shared logic for the web endpoint
def _do_transcribe(audio_bytes: bytes) -> dict:
    whisper = QuranWhisper()
    return whisper.transcribe.remote(audio_bytes)


@app.function(
    image=whisper_image,
    timeout=120,
)
@modal.fastapi_endpoint(method="POST")
def transcribe_api(request: dict) -> dict:
    audio_base64 = request.get("audio_base64", "")
    if not audio_base64:
        return {"success": False, "error": "No audio_base64 provided"}

    try:
        if "," in audio_base64:
            audio_base64 = audio_base64.split(",")[1]
        audio_bytes = base64.b64decode(audio_base64)

        if len(audio_bytes) < 100:
            return {"success": False, "error": "Audio data too small"}

        return _do_transcribe(audio_bytes)
    except Exception as e:
        return {"success": False, "error": f"Error: {str(e)}"}


# Health check endpoint (GET) — no GPU needed but uses same image for FastAPI
@app.function(image=whisper_image, timeout=10)
@modal.fastapi_endpoint(method="GET")
def health() -> dict:
    return {"status": "ok", "model": "tarteel-ai/whisper-base-ar-quran"}


@app.local_entrypoint()
def main():
    import sys
    print("Testing QuranWhisper deployment...")
    whisper = QuranWhisper()
    health = whisper.health_check.remote() if hasattr(whisper, 'health_check') else "N/A"
    print(f"Health: {health}")

    if len(sys.argv) > 1:
        with open(sys.argv[1], "rb") as f:
            audio_bytes = f.read()
        result = whisper.transcribe.remote(audio_bytes)
        print(f"Result: {result}")
