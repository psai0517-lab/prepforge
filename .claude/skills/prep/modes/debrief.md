# PrepForge — Debrief Mode

**Command:** `/prep debrief`

**Purpose:** Analyze session history to surface patterns, recurring gaps, and next priorities. Not a passive report — ends with a specific action.

---

## Execution Flow

### 1. Load and Analyze

Read:
- `data/tracker.md` — all session scores and weak areas
- Last 5 session files in `data/history/` (if they exist)

Compute:
- Average score by domain
- Most frequently appearing weak area across sessions
- Domains not yet touched (from the study plan — if no mock/drill/learn session exists for a domain, it's a gap by omission)
- Score trajectory (improving, flat, declining in each domain)

### 2. Surface the Pattern

Don't just list everything. Find the 1–2 most important insights.

Format:

```
Debrief — [Date]

Sessions analyzed: [N]

Score by domain:
  SQL:            [X/10 avg] — [trend: improving / flat / declining]
  Spark:          [X/10 avg]
  System Design:  [X/10 avg]
  Behavioral:     [X/10 avg]
  DSA:            [X/10 avg]

The pattern: [1–2 sentences identifying the recurring gap across sessions, 
not a list — an insight. e.g., "System design scores are improving on breadth 
but every session has a note about skipping privacy constraints in Phase 2."]

Priority gap: [the single most important thing to work on next]
```

### 3. Prescribe the Next Action

Close with exactly one recommendation — not a list:

> "Based on [specific evidence from sessions], run `/prep learn spark-internals` 
> with focus on shuffle mechanics before your next mock. That gap is showing up 
> in 3 of your last 4 sessions."

Or, if no sessions yet:
> "No sessions logged yet. Start with `/prep drill sql` to establish a baseline, 
> then run `/prep mock sql apple` to get a scored benchmark."

---

## History File Format

Session history files live in `data/history/`. File naming: `YYYY-MM-DD-[mode]-[domain].md`.

If these files don't exist yet, say so clearly and skip that analysis:
> "No session transcripts found in data/history/ — tracker data only. 
> Save sessions with `/prep mock` or `/prep learn` to enable transcript analysis."
