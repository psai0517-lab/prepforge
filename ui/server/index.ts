import "dotenv/config";
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

  // ── Session streaming endpoint ────────────────────────────────────────────
  const skillRoot = path.resolve(__dirname, "..", "..", ".claude", "skills", "prep");

  function loadModeFile(mode: string): string {
    try {
      return readFileSync(path.join(skillRoot, "modes", `${mode}.md`), "utf8");
    } catch {
      return "";
    }
  }

  function buildSystemPrompt(
    mode: string,
    company: string,
    domain: string,
    profileRaw: string,
  ): string {
    const shared = loadModeFile("_shared");
    const modeContent = loadModeFile(mode);
    const companyLabel = company.charAt(0).toUpperCase() + company.slice(1);
    const domainLabel = domain || "general";

    return `You are conducting a real ${companyLabel} ${mode} interview for a ${domainLabel} role.

CANDIDATE PROFILE:
${profileRaw}

SHARED PRINCIPLES:
${shared}

MODE INSTRUCTIONS:
${modeContent}

CRITICAL RULES:
- Stay in character as the ${companyLabel} interviewer at all times.
- Be direct and concise — this is a real interview, not a tutorial.
- Ask ONE question at a time. Wait for the candidate to respond before continuing.
- Calibrate to ICT5/Staff level at ${companyLabel}.
- Start immediately: introduce yourself in one sentence, then ask your first question.
- Do not explain what you are going to do — just do it.`;
  }

  app.post("/api/session/message", async (req, res) => {
    const { messages, mode, company, domain } = req.body as {
      messages: { role: "user" | "assistant"; content: string }[];
      mode: string;
      company: string;
      domain: string;
    };

    let profileRaw = "";
    try {
      profileRaw = readFileSync(path.join(dataRoot, "profile.yml"), "utf8");
    } catch { /* no profile */ }

    const systemPrompt = buildSystemPrompt(mode, company, domain, profileRaw);

    // SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    try {
      const stream = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages.length > 0 ? messages : [
          { role: "user", content: "Begin the interview." },
        ],
        stream: true,
      });

      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
        }
      }
      res.write("data: [DONE]\n\n");
    } catch (err) {
      console.error("Session stream error:", err);
      res.write(`data: ${JSON.stringify({ error: "Stream failed" })}\n\n`);
    }

    res.end();
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
      // Strip markdown code fences if present (```json ... ``` or ``` ... ```)
      const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
      const result = JSON.parse(cleaned);
      res.json(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("Evaluation error:", msg);
      res.status(500).json({ error: `Evaluation failed: ${msg}` });
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
