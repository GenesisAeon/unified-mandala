import express from "express";

const OLLAMA = process.env.QWEN_ENDPOINT ?? "http://localhost:11434";
const MODEL = process.env.QWEN_MODEL ?? "qwen2.5:7b";
const PORT = Number(process.env.PORT ?? 4000);

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, provider: "ollama", model: MODEL });
});

app.post("/api/ai/chat", async (req, res) => {
  try {
    const { messages = [], stream = false } = req.body ?? {};
    const upstream = await fetch(`${OLLAMA.replace(/\/+$/, "")}/api/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ model: MODEL, messages, stream }),
    });

    if (!upstream.ok) {
      const detail = await upstream.text();
      return res.status(502).json({ error: "ollama_upstream", detail });
    }

    const data = await upstream.json();
    res.json({
      model: data.model,
      created_at: data.created_at,
      output_text: data?.message?.content ?? "",
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

app.listen(PORT, () => {
  console.log(`[ollama-proxy] http://localhost:${PORT} → ${OLLAMA} (${MODEL})`);
});
