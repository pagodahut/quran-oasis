/**
 * Quran Offline Transcription - Transformers.js Demo
 * 
 * Uses Tarteel's fine-tuned Whisper model for Quran recitation.
 * Runs entirely in-browser using WebGPU/WASM.
 */

import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.3.3';

// Configuration
// Using ONNX-converted model for Transformers.js compatibility
// Original: tarteel-ai/whisper-tiny-ar-quran (PyTorch only)
// Converted: omartariq612/tarteel-ai-whisper-tiny-ar-quran-onnx (ONNX for browser)
const MODEL_ID = 'omartariq612/tarteel-ai-whisper-tiny-ar-quran-onnx';
const SAMPLE_RATE = 16000;

// State
let transcriber = null;
let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;
let startTime = null;
let audioContext = null;
let analyser = null;
let animationId = null;

// DOM Elements
const modelStatus = document.getElementById('modelStatus');
const loadTime = document.getElementById('loadTime');
const progressFill = document.getElementById('progressFill');
const recordBtn = document.getElementById('recordBtn');
const recordHint = document.getElementById('recordHint');
const waveform = document.getElementById('waveform');
const transcription = document.getElementById('transcription');
const inferenceTime = document.getElementById('inferenceTime');
const audioDuration = document.getElementById('audioDuration');
const logs = document.getElementById('logs');

// Logging utility
function log(message, level = 'info') {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    const entry = document.createElement('div');
    entry.className = `log-entry log-${level}`;
    entry.innerHTML = `<span class="log-time">[${time}]</span> ${message}`;
    logs.appendChild(entry);
    logs.scrollTop = logs.scrollHeight;
    console.log(`[${level.toUpperCase()}] ${message}`);
}

// Initialize waveform bars
function initWaveform() {
    waveform.innerHTML = '';
    for (let i = 0; i < 32; i++) {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = '4px';
        waveform.appendChild(bar);
    }
}

// Update waveform visualization
function updateWaveform() {
    if (!analyser || !isRecording) return;
    
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);
    
    const bars = waveform.querySelectorAll('.bar');
    const step = Math.floor(dataArray.length / bars.length);
    
    bars.forEach((bar, i) => {
        const value = dataArray[i * step];
        const height = Math.max(4, (value / 255) * 50);
        bar.style.height = `${height}px`;
    });
    
    animationId = requestAnimationFrame(updateWaveform);
}

// Load the model
async function loadModel() {
    log('Starting model download...', 'info');
    const loadStart = performance.now();
    
    try {
        // Configure environment
        env.allowLocalModels = false;
        env.useBrowserCache = true;
        
        // Create pipeline with progress callback
        transcriber = await pipeline('automatic-speech-recognition', MODEL_ID, {
            progress_callback: (progress) => {
                if (progress.status === 'downloading') {
                    const percent = progress.progress?.toFixed(1) || 0;
                    progressFill.style.width = `${percent}%`;
                    modelStatus.textContent = `Downloading... ${percent}%`;
                    log(`Downloading ${progress.file}: ${percent}%`, 'info');
                } else if (progress.status === 'loading') {
                    modelStatus.textContent = 'Loading model...';
                    log(`Loading ${progress.file || 'model'}...`, 'info');
                }
            },
            dtype: 'fp32', // Use fp32 for better compatibility
        });
        
        const loadEnd = performance.now();
        const loadDuration = ((loadEnd - loadStart) / 1000).toFixed(2);
        
        modelStatus.textContent = 'Ready';
        modelStatus.className = 'status-value ready';
        loadTime.textContent = `${loadDuration}s`;
        progressFill.style.width = '100%';
        
        recordBtn.disabled = false;
        recordHint.textContent = 'Tap to record Quran recitation';
        
        log(`Model loaded successfully in ${loadDuration}s`, 'success');
        
    } catch (error) {
        modelStatus.textContent = 'Error';
        modelStatus.className = 'status-value error';
        recordHint.textContent = 'Failed to load model';
        log(`Error: ${error.message}`, 'error');
        console.error(error);
    }
}

// Convert audio blob to float32 array at 16kHz
async function processAudio(blob) {
    log('Processing audio...', 'info');
    
    const arrayBuffer = await blob.arrayBuffer();
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: SAMPLE_RATE });
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    
    // Get audio data (mono)
    let audioData;
    if (audioBuffer.numberOfChannels === 2) {
        // Mix stereo to mono
        const left = audioBuffer.getChannelData(0);
        const right = audioBuffer.getChannelData(1);
        audioData = new Float32Array(left.length);
        for (let i = 0; i < left.length; i++) {
            audioData[i] = (left[i] + right[i]) / 2;
        }
    } else {
        audioData = audioBuffer.getChannelData(0);
    }
    
    // Resample if needed
    if (audioBuffer.sampleRate !== SAMPLE_RATE) {
        log(`Resampling from ${audioBuffer.sampleRate}Hz to ${SAMPLE_RATE}Hz`, 'info');
        const ratio = SAMPLE_RATE / audioBuffer.sampleRate;
        const newLength = Math.round(audioData.length * ratio);
        const resampled = new Float32Array(newLength);
        
        for (let i = 0; i < newLength; i++) {
            const srcIndex = i / ratio;
            const srcIndexFloor = Math.floor(srcIndex);
            const srcIndexCeil = Math.min(srcIndexFloor + 1, audioData.length - 1);
            const t = srcIndex - srcIndexFloor;
            resampled[i] = audioData[srcIndexFloor] * (1 - t) + audioData[srcIndexCeil] * t;
        }
        audioData = resampled;
    }
    
    const duration = (audioData.length / SAMPLE_RATE).toFixed(2);
    log(`Audio processed: ${duration}s duration`, 'success');
    
    return { audioData, duration };
}

// Transcribe audio
async function transcribe(audioData) {
    log('Starting transcription...', 'info');
    transcription.textContent = 'جارٍ النسخ...';
    transcription.className = 'arabic-text';
    
    const inferenceStart = performance.now();
    
    try {
        const result = await transcriber(audioData, {
            language: 'arabic',
            task: 'transcribe',
            chunk_length_s: 30,
            stride_length_s: 5,
        });
        
        const inferenceEnd = performance.now();
        const inferenceDuration = ((inferenceEnd - inferenceStart) / 1000).toFixed(2);
        
        inferenceTime.textContent = `${inferenceDuration}s`;
        
        const text = result.text.trim();
        transcription.textContent = text || '(لم يتم اكتشاف كلام)';
        
        log(`Transcription complete in ${inferenceDuration}s`, 'success');
        log(`Result: "${text}"`, 'info');
        
        return { text, inferenceDuration };
        
    } catch (error) {
        transcription.textContent = 'Error during transcription';
        transcription.className = 'arabic-text placeholder';
        log(`Transcription error: ${error.message}`, 'error');
        console.error(error);
        throw error;
    }
}

// Start recording
async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
                sampleRate: SAMPLE_RATE,
                channelCount: 1,
                echoCancellation: true,
                noiseSuppression: true,
            }
        });
        
        // Setup audio visualization
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        
        // Initialize waveform
        initWaveform();
        waveform.style.display = 'flex';
        
        // Start media recorder
        mediaRecorder = new MediaRecorder(stream, {
            mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
        });
        
        audioChunks = [];
        
        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                audioChunks.push(e.data);
            }
        };
        
        mediaRecorder.onstop = async () => {
            const blob = new Blob(audioChunks, { type: mediaRecorder.mimeType });
            log(`Recording stopped: ${(blob.size / 1024).toFixed(1)}KB`, 'info');
            
            try {
                const { audioData, duration } = await processAudio(blob);
                audioDuration.textContent = `${duration}s`;
                await transcribe(audioData);
            } catch (error) {
                log(`Processing error: ${error.message}`, 'error');
            }
        };
        
        mediaRecorder.start(1000); // Collect data every second
        isRecording = true;
        startTime = Date.now();
        
        recordBtn.classList.add('recording');
        recordHint.textContent = 'Recording... Tap to stop';
        
        // Start visualization
        updateWaveform();
        
        log('Recording started', 'success');
        
    } catch (error) {
        log(`Microphone access error: ${error.message}`, 'error');
        recordHint.textContent = 'Microphone access denied';
    }
}

// Stop recording
function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
    
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    if (audioContext) {
        audioContext.close();
        audioContext = null;
    }
    
    isRecording = false;
    recordBtn.classList.remove('recording');
    waveform.style.display = 'none';
    recordHint.textContent = 'Tap to record again';
}

// Toggle recording
function toggleRecording() {
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
}

// Event listeners
recordBtn.addEventListener('click', toggleRecording);

// Keyboard shortcut
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !recordBtn.disabled) {
        e.preventDefault();
        toggleRecording();
    }
});

// Initialize
log('Quran Offline Transcription initialized', 'info');
log(`Using model: ${MODEL_ID}`, 'info');
loadModel();
