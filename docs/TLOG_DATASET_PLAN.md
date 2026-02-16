# TLOG Dataset Analysis & Tajweed Classifier Training Plan

> **Research Date**: February 2026  
> **Status**: Research Complete - Awaiting HuggingFace Terms Acceptance

---

## Executive Summary

This document analyzes the **TLOG dataset** from Tarteel AI and related Quranic audio resources for training a tajweed error classifier. Key finding: TLOG provides excellent base audio data (720K samples) but **lacks explicit tajweed error labels**. We'll need to combine multiple datasets and approaches.

---

## 1. TLOG Dataset Overview

### Access Requirements
- **URL**: https://huggingface.co/datasets/tarteel-ai/tlog
- **Access**: Requires accepting terms on Hugging Face
- **Process**: 
  1. Create/login to Hugging Face account
  2. Navigate to dataset page
  3. Accept contact information sharing terms
  4. Access granted immediately after acceptance

### Dataset Statistics
| Metric | Value |
|--------|-------|
| Total Samples | ~720,000 |
| Last Updated | July 2025 |
| Downloads/Month | ~308 |
| Format | Audio + Text |

### Data Structure

Each sample contains:

```python
{
    "audio": {
        "array": [...],           # Audio signal as numpy array
        "sample_rate": 16000,     # Sample rate (typically 16kHz)
        "path": "surahNum_ayahNum_id.wav"  # Filename
    },
    "label": "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",  # Arabic text (Uthmani + Tashkeel)
    "is_clean": true              # Data quality flag
}
```

### Filename Convention
```
{surah_number}_{ayah_number}_{unique_id}.wav
Example: 2_1_2321423.wav → Surah 2, Ayah 1
```

### Data Splits
| Split | Description |
|-------|-------------|
| `clean` | Valid filename format, non-corrupt audio |
| `unclean` | Invalid format or potentially corrupt (label = 0) |

### Important Limitations
⚠️ **Labels are inferred from filename**, not validated against actual audio content
⚠️ **No explicit tajweed error annotations** - this is a recitation dataset, not an error detection dataset

---

## 2. Related Datasets for Tajweed Error Detection

### QDAT Dataset (Recommended for Error Labels)
- **Source**: Kaggle (referenced in academic papers)
- **Size**: 1,500+ audio files
- **Key Feature**: **Labeled correct AND incorrect recitations**
- **Tajweed Rules Covered**:
  1. **Al Mad** (Separate stretching / المد)
  2. **Ghunnah** (Tight Noon / الغنة)  
  3. **Ikhfaa** (Hide / الإخفاء)
- **Format**: Single verse (Ayah) recordings with expert annotations
- **Usage**: Used in LSTM models achieving 95-96% accuracy per rule

### obadx/recitation-segmentation Dataset
- **URL**: https://huggingface.co/datasets/obadx/recitation-segmentation
- **Size**: 850+ hours (~300K annotated utterances)
- **Features**:
  - Segmentation at waqf (pause) points
  - Speech interval timestamps
  - Multiple reciters (expert level)
  - **Quran Phonetic Script (QPS)** encoding tajweed rules
- **Key Innovation**: Novel encoding system for tajweed rules (better than IPA for MSA)
- **Access**: Publicly available, no terms required

### Tarteel everyayah Dataset
- **URL**: https://huggingface.co/datasets/tarteel-ai/everyayah
- **Size**: ~127K samples
- **Content**: Professional recitations with diacritization
- **Use Case**: Clean reference audio for comparison

---

## 3. Dataset Schema Comparison

| Dataset | Samples | Error Labels | Tajweed Rules | Access |
|---------|---------|--------------|---------------|--------|
| TLOG | 720K | ❌ No | N/A | HF Terms |
| QDAT | 1.5K | ✅ Yes | 3 rules | Kaggle |
| obadx | 300K | ✅ Via QPS | Full phonetic | Public |
| everyayah | 127K | ❌ No | N/A | Public |

---

## 4. Training a Tajweed Error Classifier

### Approach 1: Fine-tune Whisper-based ASR + Error Detection

**Architecture**:
```
Audio Input → Whisper Encoder → Phoneme Decoder → Error Classifier
                                        ↓
                              Quran Phonetic Script (QPS)
```

**Key Components**:
1. Use `obadx/muaalem-model-v3_2` as base (600M params, 0.16% PER)
2. Add classification head for tajweed rule violations
3. Train on combined QDAT + augmented TLOG samples

**Estimated Requirements**:
- GPU: A100 40GB (or 2x RTX 4090)
- Training Time: ~24-48 hours for fine-tuning
- Dataset: Need to generate error labels for TLOG samples

### Approach 2: Contrastive Learning (Correct vs Incorrect)

**Architecture**:
```
[Correct Audio] ──┬──> Shared Encoder ──> Embedding Space
                  │                              │
[Error Audio] ────┘                        Contrastive Loss
```

**Benefits**:
- Doesn't require explicit error labels
- Can use TLOG (correct) vs synthetic errors
- More scalable approach

**Requirements**:
- Generate synthetic errors from TLOG
- Use phoneme-level augmentation
- Train with triplet loss or InfoNCE

### Approach 3: Multi-Level CTC with QPS (Recommended)

Based on the recent obadx paper (Aug 2025):

**Architecture**:
```
Audio → wav2vec2-BERT → Multi-Level CTC Decoder
                              ↓
                     ┌───────────────┐
                     │ Phoneme Level │ → Letter + vowel errors
                     └───────────────┘
                              ↓
                     ┌───────────────┐
                     │  Sifa Level   │ → Articulation characteristics
                     └───────────────┘
```

**Quran Phonetic Script (QPS) Levels**:
1. **Phoneme Level**: Arabic letters + short/long vowels
2. **Sifa Level**: Articulation characteristics of every phoneme

**Results**: 0.16% Phoneme Error Rate on test set

---

## 5. Implementation Plan

### Phase 1: Data Acquisition (Week 1)
- [ ] Accept TLOG terms on Hugging Face
- [ ] Download TLOG clean split (~500K samples)
- [ ] Download QDAT from Kaggle
- [ ] Download obadx/recitation-segmentation

### Phase 2: Data Preparation (Week 2)
- [ ] Standardize audio format (16kHz mono WAV)
- [ ] Align TLOG with Quran text using obadx segmenter
- [ ] Extract phoneme sequences using QPS
- [ ] Split data: 80% train, 10% validation, 10% test

### Phase 3: Model Training (Weeks 3-4)
- [ ] Start with obadx/muaalem-model-v3 as base
- [ ] Add tajweed classification heads for target rules:
  - Al Mad (stretching)
  - Ghunnah (nasalization)
  - Ikhfaa (hiding)
  - Idgham (merging)
  - Qalqalah (echoing)
- [ ] Train multi-task model
- [ ] Evaluate on QDAT test set

### Phase 4: Integration (Week 5)
- [ ] Export to ONNX/CoreML for mobile
- [ ] Integrate with Quran Oasis real-time pipeline
- [ ] Benchmark inference latency (<100ms target)

---

## 6. Compute Requirements

### Training
| Resource | Minimum | Recommended |
|----------|---------|-------------|
| GPU | RTX 3090 (24GB) | A100 (40GB) |
| RAM | 32GB | 64GB |
| Storage | 200GB SSD | 500GB NVMe |
| Time | 48-72 hours | 24-36 hours |

### Inference (Mobile)
| Platform | Model Size | Latency Target |
|----------|------------|----------------|
| iOS | <100MB | <100ms |
| Android | <100MB | <150ms |
| Web | <50MB | <200ms |

### Cost Estimates (Cloud)
- **AWS p4d.24xlarge**: ~$32/hr × 36hr = ~$1,150
- **Google Cloud A100**: ~$3/hr × 36hr = ~$108
- **Lambda Labs A100**: ~$1.10/hr × 36hr = ~$40
- **Vast.ai RTX 4090**: ~$0.40/hr × 72hr = ~$30

---

## 7. Key References

### Papers
1. **"Automatic Pronunciation Error Detection and Correction"** (Aug 2025)
   - https://arxiv.org/abs/2509.00094
   - Introduces QPS and multi-level CTC
   
2. **"Mispronunciation Detection of Basic Quranic Recitation Rules"** (May 2023)
   - https://arxiv.org/abs/2305.06429
   - LSTM + MFCC achieving 95-96% on QDAT

3. **"The Tarteel Dataset"** (NeurIPS 2022)
   - https://openreview.net/pdf?id=TAdzPkgnnV8
   - Original TLOG paper

### Code & Models
- **obadx/recitations-segmenter**: https://github.com/obadx/recitations-segmenter
- **obadx/muaalem-model-v3_2**: https://huggingface.co/obadx/muaalem-model-v3_2
- **tarteel-ai/whisper-base-ar-quran**: https://huggingface.co/tarteel-ai/whisper-base-ar-quran

---

## 8. Next Steps

1. **Immediate**: Accept TLOG terms → download subset for exploration
2. **Short-term**: Set up training pipeline with obadx models as starting point
3. **Medium-term**: Train custom tajweed classifier with 5+ rules
4. **Long-term**: Deploy on-device model for real-time feedback

---

## 9. Questions Answered

### What's the exact format of each sample?
- **Audio**: WAV, 16kHz, mono channel
- **Text**: Arabic (Uthmani script with full tashkeel/diacritics)
- **Metadata**: Surah number, Ayah number, unique ID in filename

### How are labels structured?
- **TLOG**: No explicit labels beyond text transcription
- **QDAT**: Binary (correct/incorrect) per tajweed rule
- **obadx**: QPS phoneme sequences at 2 levels

### What would we need to train a tajweed error classifier?
1. Labeled error data (QDAT provides 1.5K samples)
2. Clean reference audio (TLOG/everyayah)
3. Phoneme-level alignment (obadx segmenter)
4. Pre-trained ASR model for transfer learning

### Estimated compute requirements?
- **Fine-tuning**: 24-48 hours on A100
- **Full training**: 72-96 hours on RTX 4090
- **Cost**: $30-150 (cloud GPU rental)

---

*Document generated by Quran Oasis AI Research Pipeline*
