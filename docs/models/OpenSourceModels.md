# Open Source Model Setup

This guide outlines how to configure local open‑source model servers and how Mandala routes requests between them.

## Environment Variables
Each provider exposes an HTTP endpoint. Set the following variables or copy `docs/snippets/ENV_MODELS.example` to your environment:

```bash
# Ollama model server endpoint
OLLAMA_URL=http://localhost:11434

# Text Generation Inference (TGI) endpoint
TGI_URL=http://localhost:8080

# vLLM endpoint
VLLM_URL=http://localhost:8000
```

## Providers

### Ollama
[Ollama](https://ollama.ai) serves lightweight models locally. Launch the daemon and pull a model, e.g.:

```bash
ollama serve &
ollama pull mistral
```

### Text Generation Inference
[Text Generation Inference](https://github.com/huggingface/text-generation-inference) (TGI) powers larger transformers.
A minimal Docker launch looks like:

```bash
docker run -p 8080:80 ghcr.io/huggingface/text-generation-inference:latest --model-id mistralai/Mistral-7B-Instruct-v0.2
```

### vLLM
[vLLM](https://github.com/vllm-project/vllm) provides fast generation with continuous batching:

```bash
python -m vllm.entrypoints.api_server --model facebook/opt-125m --host 0.0.0.0 --port 8000
```

## Routing with ModelRouter
The upcoming `ModelRouter` module dispatches generation requests to a provider based on configuration. Example usage:

```ts
import { ModelRouter } from "packages/gpt-bridges/router/ModelRouter";

const router = new ModelRouter();
const result = await router.generate({ model: "ollama:mistral", prompt: "Hello" });
```

The prefix before `:` selects the provider (`ollama`, `tgi`, `vllm`). Provider URLs are read from the environment variables above.

## Troubleshooting
Ensure each service is reachable at its URL. Network errors or missing models will surface in router logs. Consult provider documentation for advanced configuration.

