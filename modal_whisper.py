"""
Modal deployment for Tarteel's Quran-trained Whisper model.
Provides server-side Arabic Quran transcription with GPU acceleration.

Deploy: modal deploy modal_whisper.py
Test:   modal run modal_whisper.py
"""

import modal
import io
import base64

# Define the app
app = modal.App("hifz-whisper")

# Build the image with all dependencies
whisper_image = modal.Image.debian_slim(python_version="3.11").pip_install(
    "transformers>=4.36.0",
    "torch>=2.1.0",
    "torchaudio>=2.1.0",
    "librosa>=0.10.0",
    "soundfile>=0.12.0",
    "accelerate>=0.25.0",
    "numpy<2.0",  # Compatibility with older librosa
    "fastapi[standard]",  # Required for web endpoints
)


@app.cls(
    gpu="T4",
    image=whisper_image,
    scaledown_window=300,  # Keep warm for 5 minutes
    timeout=600,  # 10 minute max per request
)
class QuranWhisper:
    """
    Whisper model fine-tuned on Quran recitation by Tarteel AI.
    Optimized for Arabic Quranic text transcription.
    """

    @modal.enter()
    def load_model(self):
        """Load the model once when container starts."""
        import torch
        from transformers import WhisperProcessor, WhisperForConditionalGeneration

        model_name = "tarteel-ai/whisper-base-ar-quran"
        print(f"Loading model: {model_name}")
        
        self.processor = WhisperProcessor.from_pretrained(model_name)
        self.model = WhisperForConditionalGeneration.from_pretrained(model_name)
        
        # Move to GPU
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model.to(self.device)
        self.model.eval()
        
        print(f"Model loaded on {self.device}")

    @modal.method()
    def transcribe(self, audio_bytes: bytes, sample_rate: int = 16000) -> dict:
        """
        Transcribe audio bytes to Arabic Quranic text.
        
        Args:
            audio_bytes: Raw audio bytes (WAV, MP3, or raw PCM)
            sample_rate: Sample rate of the audio (default 16000 Hz)
            
        Returns:
            dict with 'text' (transcription) and 'success' boolean
        """
        import torch
        import librosa
        import numpy as np
        import soundfile as sf
        
        try:
            # Try to load audio from bytes
            audio_buffer = io.BytesIO(audio_bytes)
            
            try:
                # Try soundfile first (handles WAV, FLAC, OGG)
                audio, sr = sf.read(audio_buffer)
            except Exception:
                # Fall back to librosa (handles MP3, etc.)
                audio_buffer.seek(0)
                audio, sr = librosa.load(audio_buffer, sr=None)
            
            # Convert to mono if stereo
            if len(audio.shape) > 1:
                audio = np.mean(audio, axis=1)
            
            # Resample to 16kHz if needed (Whisper requirement)
            if sr != 16000:
                audio = librosa.resample(audio, orig_sr=sr, target_sr=16000)
            
            # Ensure float32
            audio = audio.astype(np.float32)
            
            # Process through Whisper
            inputs = self.processor(
                audio,
                sampling_rate=16000,
                return_tensors="pt"
            )
            input_features = inputs.input_features.to(self.device)
            
            # Generate transcription (model is fine-tuned for Arabic Quran)
            with torch.no_grad():
                generated_ids = self.model.generate(
                    input_features,
                    max_length=448,
                )
            
            # Decode
            transcription = self.processor.batch_decode(
                generated_ids,
                skip_special_tokens=True
            )[0]
            
            # Clean up any remaining special tokens
            import re
            transcription = re.sub(r'<\|[^|]+\|>', '', transcription).strip()
            
            return {
                "success": True,
                "text": transcription,
                "duration_seconds": len(audio) / 16000,
            }
            
        except Exception as e:
            return {
                "success": False,
                "text": "",
                "error": str(e),
            }

    @modal.method()
    def transcribe_base64(self, audio_base64: str) -> dict:
        """
        Transcribe base64-encoded audio.
        Convenience method for web clients.
        """
        try:
            # Handle data URLs
            if "," in audio_base64:
                audio_base64 = audio_base64.split(",")[1]
            
            audio_bytes = base64.b64decode(audio_base64)
            return self.transcribe(audio_bytes)
        except Exception as e:
            return {
                "success": False,
                "text": "",
                "error": f"Base64 decode error: {str(e)}",
            }

    @modal.method()
    def health_check(self) -> dict:
        """Check if the model is loaded and ready."""
        import torch
        return {
            "status": "healthy",
            "device": self.device,
            "cuda_available": torch.cuda.is_available(),
            "model": "tarteel-ai/whisper-base-ar-quran",
        }


# Shared transcription logic
def _transcribe_audio(audio_bytes: bytes) -> dict:
    """Core transcription logic shared by all endpoints."""
    import torch
    from transformers import WhisperProcessor, WhisperForConditionalGeneration
    import librosa
    import numpy as np
    import soundfile as sf
    
    try:
        # Load model (cached after first load)
        model_name = "tarteel-ai/whisper-base-ar-quran"
        processor = WhisperProcessor.from_pretrained(model_name)
        model = WhisperForConditionalGeneration.from_pretrained(model_name)
        device = "cuda" if torch.cuda.is_available() else "cpu"
        model.to(device)
        model.eval()
        
        # Load audio
        audio_buffer = io.BytesIO(audio_bytes)
        try:
            audio, sr = sf.read(audio_buffer)
        except Exception:
            audio_buffer.seek(0)
            audio, sr = librosa.load(audio_buffer, sr=None)
        
        if len(audio.shape) > 1:
            audio = np.mean(audio, axis=1)
        if sr != 16000:
            audio = librosa.resample(audio, orig_sr=sr, target_sr=16000)
        audio = audio.astype(np.float32)
        
        # Transcribe
        inputs = processor(audio, sampling_rate=16000, return_tensors="pt")
        input_features = inputs.input_features.to(device)
        
        with torch.no_grad():
            # Model is already fine-tuned for Arabic Quran, no need to force language
            generated_ids = model.generate(
                input_features,
                max_length=448,
            )
        
        transcription = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
        
        # Clean up any remaining special tokens
        import re
        transcription = re.sub(r'<\|[^|]+\|>', '', transcription).strip()
        
        return {
            "success": True,
            "text": transcription,
            "model": "tarteel-ai/whisper-base-ar-quran",
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
        }


# Web endpoint for HTTP access (JSON with base64)
@app.function(
    image=whisper_image,
    gpu="T4",
    scaledown_window=300,
    timeout=120,
)
@modal.fastapi_endpoint(method="POST")
def transcribe_api(request: dict) -> dict:
    """
    HTTP endpoint for transcription (JSON body).
    
    POST body (JSON):
        - audio_base64: Base64-encoded audio data
        
    Returns:
        - text: Transcribed Arabic text
        - success: Boolean
        - error: Error message if failed
    """
    audio_base64 = request.get("audio_base64", "")
    
    if not audio_base64:
        return {"success": False, "error": "No audio_base64 provided"}
    
    try:
        # Decode base64
        if "," in audio_base64:
            audio_base64 = audio_base64.split(",")[1]
        audio_bytes = base64.b64decode(audio_base64)
        return _transcribe_audio(audio_bytes)
    except Exception as e:
        return {"success": False, "error": f"Base64 decode error: {str(e)}"}


@app.local_entrypoint()
def main():
    """Test the deployment locally."""
    import sys
    
    print("Testing QuranWhisper deployment...")
    
    # Create instance
    whisper = QuranWhisper()
    
    # Health check
    health = whisper.health_check.remote()
    print(f"Health check: {health}")
    
    # Test with a sample if provided
    if len(sys.argv) > 1:
        audio_path = sys.argv[1]
        print(f"Transcribing: {audio_path}")
        
        with open(audio_path, "rb") as f:
            audio_bytes = f.read()
        
        result = whisper.transcribe.remote(audio_bytes)
        print(f"Result: {result}")
    else:
        print("No audio file provided. Run with: modal run modal_whisper.py path/to/audio.wav")
        print("\nDeployment info:")
        print("  Deploy: modal deploy modal_whisper.py")
        print("  The web endpoint will be available at your Modal workspace URL")
