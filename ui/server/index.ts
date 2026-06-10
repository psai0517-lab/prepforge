import Anthropic from "@anthropic-ai/sdk";
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());

  // ── Evaluation endpoint ────────────────────────────────────────────────────
  app.post("/api/evaluate", async (req, res) => {
    const { question, modelAnswer, userAnswer } = req.body as {
      question: string;
      modelAnswer: string;
      userAnswer: string;
    };

    if (!question || !modelAnswer || !userAnswer?.trim()) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const message = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        system: `You are a Staff-level Data Engineer evaluating a technical interview answer.
Be strict but fair. Evaluate whether the answer captures the KEY concepts, not whether it's word-for-word identical.
Respond ONLY with valid JSON — no markdown, no explanation outside the JSON.`,
        messages: [
          {
            role: "user",
            content: `Question: ${question}

Model Answer: ${modelAnswer}

Candidate's Answer: ${userAnswer}

Return JSON with exactly these fields:
{
  "verdict": "correct" | "partial" | "incorrect",
  "feedback": "1-2 specific sentences — what they got right and/or what key concept is missing"
}

"correct" = captured the core concepts and at least one key tradeoff
"partial" = right direction but missing an important mechanism or tradeoff
"incorrect" = fundamentally wrong or answered a different question`,
          },
        ],
      });

      const raw = (message.content[0] as { text: string }).text.trim();
      const result = JSON.parse(raw);
      res.json(result);
    } catch (err) {
      console.error("Evaluation error:", err);
      res.status(500).json({ error: "Evaluation failed" });
    }
  });

  // ── Static serving (production only) ──────────────────────────────────────
  if (process.env.NODE_ENV === "production") {
    const staticPath = path.resolve(__dirname, "public");
    app.use(express.static(staticPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(staticPath, "index.html"));
    });
  }

  const port = process.env.PORT || (process.env.NODE_ENV === "production" ? 3000 : 3001);

  server.listen(port, () => {
    console.log(`API server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
