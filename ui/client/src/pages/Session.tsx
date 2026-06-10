import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";

// ── Types ──────────────────────────────────────────────────────────────────

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface SessionConfig {
  mode: string;
  company: string;
  domain: string;
  topic: string;
}

// ── Constants ───────────────────────────────────────────────────────────────

const MODE_LABELS: Record<string, string> = {
  mock: "Mock Interview",
  behavioral: "Behavioral",
  "system-design": "System Design",
};

const COMPANY_LABELS: Record<string, string> = {
  apple: "Apple",
  netflix: "Netflix",
  amazon: "Amazon",
  google: "Google",
};

const SESSION_DURATION: Record<string, number> = {
  mock: 45 * 60,
  behavioral: 45 * 60,
  "system-design": 60 * 60,
};

// ── Timer hook ──────────────────────────────────────────────────────────────

function useTimer(totalSeconds: number, running: boolean) {
  const [remaining, setRemaining] = useState(totalSeconds);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);

  const pct = ((totalSeconds - remaining) / totalSeconds) * 100;
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  return { display: `${mm}:${ss}`, pct, expired: remaining === 0 };
}

// ── Streaming fetch helper ──────────────────────────────────────────────────

async function streamMessage(
  messages: Message[],
  config: SessionConfig,
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (e: string) => void,
) {
  try {
    const res = await fetch("/api/session/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages,
        mode: config.mode,
        company: config.company,
        domain: config.domain || config.topic,
      }),
    });

    if (!res.body) throw new Error("No response body");
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });

      const lines = buf.split("\n");
      buf = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") { onDone(); return; }
        try {
          const parsed = JSON.parse(data);
          if (parsed.text) onChunk(parsed.text);
          if (parsed.error) onError(parsed.error);
        } catch { /* partial chunk */ }
      }
    }
    onDone();
  } catch (e) {
    onError(String(e));
  }
}

// ── Scoring rubric (shown at end) ───────────────────────────────────────────

const RUBRIC_ITEMS = [
  "Asked clarifying questions before diving in",
  "Named specific tradeoffs, not just technologies",
  "Mentioned privacy / correctness constraints",
  "Communicated clearly under pressure",
  "Drove toward a concrete recommendation",
];

// ── Main component ──────────────────────────────────────────────────────────

export default function Session() {
  const [, navigate] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const config: SessionConfig = {
    mode: params.get("mode") ?? "mock",
    company: params.get("company") ?? "apple",
    domain: params.get("domain") ?? "",
    topic: params.get("topic") ?? "",
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [answer, setAnswer] = useState("");
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [selfScore, setSelfScore] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLTextAreaElement>(null);
  const timer = useTimer(SESSION_DURATION[config.mode] ?? 2700, sessionActive && !sessionEnded);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  // Kick off interview on mount
  useEffect(() => {
    setSessionActive(true);
    fire([]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // End when timer expires
  useEffect(() => {
    if (timer.expired && sessionActive) endSession();
  }, [timer.expired]); // eslint-disable-line react-hooks/exhaustive-deps

  const fire = useCallback((msgs: Message[]) => {
    setIsStreaming(true);
    setStreamingText("");
    let accumulated = "";

    streamMessage(
      msgs,
      config,
      (chunk) => {
        accumulated += chunk;
        setStreamingText(accumulated);
      },
      () => {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: accumulated },
        ]);
        setStreamingText("");
        setIsStreaming(false);
        answerRef.current?.focus();
      },
      (e) => {
        setError(e);
        setIsStreaming(false);
      },
    );
  }, [config]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSubmit() {
    if (!answer.trim() || isStreaming || sessionEnded) return;
    const userMsg: Message = { role: "user", content: answer.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setAnswer("");
    fire(next);
  }

  function endSession() {
    setSessionActive(false);
    setSessionEnded(true);
  }

  // ── Session end summary ──────────────────────────────────────────────────

  if (sessionEnded) {
    const duration = SESSION_DURATION[config.mode] ?? 2700;
    const elapsed = duration - Math.floor((timer.pct / 100) * duration);
    const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const ss = String(elapsed % 60).padStart(2, "0");
    const exchangeCount = messages.filter((m) => m.role === "user").length;

    return (
      <div className="min-h-screen bg-background flex items-start justify-center pt-16 px-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-10">
            <span className="font-mono text-xs tracking-widest uppercase text-accent">
              Session Complete
            </span>
            <h1 className="font-serif text-4xl mt-3 mb-2 italic">
              {COMPANY_LABELS[config.company] ?? config.company} ·{" "}
              {MODE_LABELS[config.mode] ?? config.mode}
            </h1>
            <p className="text-muted-foreground text-sm">
              {mm}:{ss} · {exchangeCount} exchange{exchangeCount !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Self-assessment rubric */}
          <div className="rounded-lg border border-border bg-card p-6 mb-6">
            <h2 className="text-sm font-medium text-foreground mb-4">
              Self-assessment — check what you demonstrated:
            </h2>
            <div className="space-y-3">
              {RUBRIC_ITEMS.map((item) => (
                <label key={item} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selfScore[item] ?? false}
                    onChange={(e) =>
                      setSelfScore((s) => ({ ...s, [item]: e.target.checked }))
                    }
                    className="w-4 h-4 rounded border-border accent-primary"
                  />
                  <span
                    className={`text-sm transition-colors ${
                      selfScore[item] ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {item}
                  </span>
                </label>
              ))}
            </div>
            {Object.values(selfScore).filter(Boolean).length > 0 && (
              <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {Object.values(selfScore).filter(Boolean).length}/{RUBRIC_ITEMS.length} demonstrated
                </span>
                <span className="font-serif italic text-2xl text-foreground">
                  {Math.round(
                    (Object.values(selfScore).filter(Boolean).length / RUBRIC_ITEMS.length) * 10,
                  )}
                  /10
                </span>
              </div>
            )}
          </div>

          {/* Transcript preview */}
          <div className="rounded-lg border border-border bg-muted/30 p-4 mb-6 max-h-64 overflow-y-auto">
            <p className="text-xs font-mono text-muted-foreground mb-3">Transcript</p>
            {messages.map((m, i) => (
              <div key={i} className="mb-3">
                <span className="text-xs font-mono text-accent">
                  {m.role === "assistant"
                    ? COMPANY_LABELS[config.company]
                    : "You"}
                  :
                </span>
                <p className="text-xs text-foreground mt-0.5 leading-relaxed whitespace-pre-wrap">
                  {m.content}
                </p>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() =>
                navigate(
                  `/session?mode=${config.mode}&company=${config.company}&domain=${config.domain}&topic=${config.topic}`,
                )
              }
              className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Run Again
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 py-2.5 border border-border text-foreground rounded-md text-sm font-medium hover:bg-muted transition-colors"
            >
              ← Back to PrepForge
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Active session ──────────────────────────────────────────────────────

  const companyLabel = COMPANY_LABELS[config.company] ?? config.company;
  const modeLabel = MODE_LABELS[config.mode] ?? config.mode;
  const domainLabel = config.domain || config.topic;
  const timerUrgent = timer.pct > 80;

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">

      {/* ── Top bar ── */}
      <header className="h-12 border-b border-border flex items-center justify-between px-4 shrink-0 bg-background/95 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-mono text-xs font-bold">PF</span>
          </div>
          <span className="text-sm font-medium text-foreground">
            {companyLabel}
          </span>
          <span className="text-muted-foreground text-sm">·</span>
          <span className="text-sm text-muted-foreground">{modeLabel}</span>
          {domainLabel && (
            <>
              <span className="text-muted-foreground text-sm">·</span>
              <span className="text-xs font-mono bg-muted border border-border px-2 py-0.5 rounded text-muted-foreground">
                {domainLabel}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Timer */}
          <div className="flex items-center gap-2">
            <div className="w-24 h-1 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  timerUrgent ? "bg-rose-500" : "bg-primary"
                }`}
                style={{ width: `${timer.pct}%` }}
              />
            </div>
            <span
              className={`text-sm font-mono tabular-nums ${
                timerUrgent ? "text-rose-500" : "text-muted-foreground"
              }`}
            >
              {timer.display}
            </span>
          </div>

          <button
            onClick={endSession}
            className="px-3 py-1 text-xs font-medium border border-border rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            End Session
          </button>
        </div>
      </header>

      {/* ── Split body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left — Interviewer chat */}
        <div className="w-1/2 flex flex-col border-r border-border overflow-hidden">
          <div className="px-4 py-2 border-b border-border/50 bg-muted/20">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
              {companyLabel} Interviewer
            </span>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages
              .filter((m) => m.role === "assistant")
              .map((m, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-mono text-primary font-bold">
                      {companyLabel[0]}
                    </span>
                  </div>
                  <div className="flex-1 bg-card border border-border rounded-lg px-4 py-3">
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                      {m.content}
                    </p>
                  </div>
                </div>
              ))}

            {/* Streaming bubble */}
            {streamingText && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-mono text-primary font-bold">
                    {companyLabel[0]}
                  </span>
                </div>
                <div className="flex-1 bg-card border border-border rounded-lg px-4 py-3">
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {streamingText}
                    <span className="inline-block w-1.5 h-3.5 bg-primary ml-0.5 animate-pulse rounded-sm" />
                  </p>
                </div>
              </div>
            )}

            {isStreaming && !streamingText && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-mono text-primary font-bold">{companyLabel[0]}</span>
                </div>
                <div className="bg-card border border-border rounded-lg px-4 py-3">
                  <div className="flex gap-1 items-center h-5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 150}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <p className="text-sm text-rose-500 px-2">{error}</p>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Previous user messages shown inline */}
          <div className="border-t border-border/50 px-4 py-2 max-h-40 overflow-y-auto bg-muted/10">
            {messages
              .filter((m) => m.role === "user")
              .slice(-2)
              .map((m, i) => (
                <div key={i} className="py-1">
                  <span className="text-xs font-mono text-muted-foreground">You: </span>
                  <span className="text-xs text-foreground">{m.content.slice(0, 120)}{m.content.length > 120 ? "…" : ""}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Right — Candidate workspace */}
        <div className="w-1/2 flex flex-col overflow-hidden">
          <div className="px-4 py-2 border-b border-border/50 bg-muted/20 flex items-center justify-between">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
              Your Answer
            </span>
            <span className="text-xs text-muted-foreground font-mono">⌘↵ submit</span>
          </div>

          <div className="flex-1 p-4 flex flex-col overflow-hidden">
            <textarea
              ref={answerRef}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              disabled={isStreaming || sessionEnded}
              placeholder={
                isStreaming
                  ? "Interviewer is responding…"
                  : "Write your answer here. For code, use monospace — this editor will not execute it.\n\nPress ⌘↵ or click Submit when ready."
              }
              className="flex-1 w-full bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm leading-relaxed px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-primary/40 placeholder:text-[#6b7280] disabled:opacity-40 border border-border/30"
              spellCheck={false}
            />

            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-mono">
                {answer.length > 0 ? `${answer.split("\n").length} lines` : ""}
              </span>
              <button
                onClick={handleSubmit}
                disabled={!answer.trim() || isStreaming || sessionEnded}
                className="px-5 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
              >
                Submit →
              </button>
            </div>
          </div>

          {/* Scoring checklist — visible during session */}
          <div className="border-t border-border/50 px-4 py-3 bg-muted/10">
            <p className="text-xs font-mono text-muted-foreground mb-2 uppercase tracking-widest">Track yourself</p>
            <div className="grid grid-cols-2 gap-1">
              {RUBRIC_ITEMS.map((item) => (
                <label key={item} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selfScore[item] ?? false}
                    onChange={(e) =>
                      setSelfScore((s) => ({ ...s, [item]: e.target.checked }))
                    }
                    className="w-3 h-3 rounded accent-primary"
                  />
                  <span className="text-xs text-muted-foreground leading-tight">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
