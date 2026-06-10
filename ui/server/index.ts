import Anthropic from "@anthropic-ai/sdk";
import express from "express";
import { readFileSync } from "fs";
import { createServer } from "http";
import yaml from "js-yaml";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Parse markdown table rows from tracker.md
function parseTracker(md: string) {
  const lines = md.split("\n").filter((l) => l.startsWith("|") && !l.match(/^[\|\s\-]+$/));
  // Skip header row
  const rows = lines.slice(1);
  return rows
    .map((row) => {
      const cells = row.split("|").map((c) => c.trim()).filter(Boolean);
      if (cells.length < 5) return null;
      const [date, mode, domain, topic, scoreRaw, weakAreas = "", notes = ""] = cells;
      const scoreMatch = scoreRaw.match(/(\d+)\s*\/\s*(\d+)/);
      if (!scoreMatch) return null;
      return {
        date,
        mode,
        domain,
        topic,
        score: parseInt(scoreMatch[1]),
        outOf: parseInt(scoreMatch[2]),
        weakAreas,
        notes,
      };
    })
    .filter(Boolean);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());

  // ── Data root (repo root, two levels up from ui/server/) ──────────────────
  const dataRoot = path.resolve(__dirname, "..", "..", "data");

  // ── Profile endpoint ───────────────────────────────────────────────────────
  app.get("/api/profile", (_req, res) => {
    try {
      const raw = readFileSync(path.join(dataRoot, "profile.yml"), "utf8");
      const profile = yaml.load(raw);
      res.json(profile);
    } catch {
      res.status(404).json({ error: "profile.yml not found" });
    }
  });

  // ── Tracker endpoint ───────────────────────────────────────────────────────
  app.get("/api/tracker", (_req, res) => {
    try {
      const raw = readFileSync(path.join(dataRoot, "tracker.md"), "utf8");
      const sessions = parseTracker(raw);
      res.json(sessions);
    } catch {
      res.json([]);
    }
  });

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
