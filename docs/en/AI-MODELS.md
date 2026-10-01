# AI Models & On-Premises Hardware Sizing Guide (2026)

## 1. On-Premises Local LLMs vs. Cloud AI Gateways

For sensitive Iranian manufacturing and financial holding environments, corporate policy strictly prohibits egress of financial records to public cloud endpoints. IEAB is engineered to operate seamlessly against on-prem inference engines via OpenAI-compatible endpoints (**vLLM**, **Ollama**, **SGLang**).

| Model Architecture | Parameters | Persian Proficiency | Function / Tool Calling | VRAM Requirement | Recommended Production Archetype |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Qwen 2.5 72B Instruct** | 72B | Outstanding | Industry Benchmark (JSON strict) | 48GB (2x RTX 3090/4090 GPTQ-Int4) | **Primary Choice for Enterprise On-Prem Deployments** |
| **DeepSeek-R1 Distill Qwen 32B** | 32B | Excellent (Deep Chain-of-Thought) | High | 24GB (1x RTX 3090/4090) | Complex Root-Cause (Why) Decompositions |
| **Qwen 2.5 32B Instruct** | 32B | Very Good | Excellent | 24GB (1x RTX 3090/4090) | Medium Enterprise / Single GPU Server |
| **Llama 3.3 70B Instruct** | 70B | Good | Very High | 48GB | General Open-Source Infrastructure |
| **Cloud Models (GPT-4o, Claude 3.5)** | - | Flawless | Industry Standard | Zero Local GPU (Cloud API) | Hybrid / Non-Sensitive Dev Environments |

---

## 2. On-Premises Hardware Specifications

To serve concurrent queries for 20+ executive users:
- **Compute (CPU):** AMD EPYC or Intel Xeon (16+ physical cores)
- **System Memory:** 128 GB DDR5 ECC
- **GPUs:**
  - Minimum: 2x NVIDIA RTX 3090 or RTX 4090 (48 GB aggregate VRAM)
  - Enterprise: 1x NVIDIA A100 80GB or 2x NVIDIA L40S 48GB
- **Storage:** 1 TB NVMe PCIe 4.0 for instant model weights loading
- **Serving Stack:** `vLLM` with `--tensor-parallel-size 2`
