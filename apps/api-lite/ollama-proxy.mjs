// Lightweight proxy that normalizes Ollama chat responses for the Mandala UI playground.
// Usage: QWEN_ENDPOINT=http://localhost:11434 QWEN_MODEL=qwen2.5:7b PORT=4000 node apps/api-lite/ollama-proxy.mjs

import express from "express";

const upstream = (process.env.QWEN_ENDPOINT ?? "http://localhost:11434").replace(/\/+$/, "");
const model = process.env.QWEN_MODEL ?? "qwen2.5:7b";
const port = Number(process.env.PORT ?? 4000);

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, provider: "ollama", model });
});

app.post("/api/ai/chat", async (req, res) => {
  try {
    const { messages = [], stream = false } = req.body ?? {};

    const upstreamResponse = await fetch(`${upstream}/api/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ model, messages, stream }),
    });

    if (!upstreamResponse.ok) {
      const detail = await upstreamResponse.text();
      res.status(502).json({ error: "ollama_upstream", detail });
      return;
    }

    const data = await upstreamResponse.json();
    const outputText = data?.message?.content ?? "";

    res.json({
      model: data.model ?? model,
      created_at: data.created_at,
      output_text: outputText,
      provider: "qwen-ollama",
      meta: {
        done: data.done,
        total_duration: data.total_duration,
        eval_count: data.eval_count,
        prompt_eval_count: data.prompt_eval_count,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "proxy_crash", detail: String(error) });
  }
});

app.listen(port, () => {
  console.log(`[ollama-proxy] http://localhost:${port} → ${upstream} (${model})`);
});
