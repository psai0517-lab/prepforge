# Mode: debrief — Gap Analysis and Action Items

Analyze session history to surface patterns, track improvement, and reprioritize the study plan.

## Inputs
- `data/tracker.md` — all session records
- `data/history/` — last 5 session transcripts (read most recent first)

## Execution

### Step 1 — Load session history
Read `data/tracker.md`. Parse all sessions in the last 30 days (or last 10 sessions, whichever is more).

### Step 2 — Compute trend data

For each tracked dimension:
- Average score by mode (mock, system-design, behavioral)
- Score trend over time (improving / flat / declining)
- Most frequently flagged weak areas across sessions

### Step 3 — Identify the critical gap

Find the single dimension that is:
1. Most frequently flagged as weak AND
2. Highest weight for the target level (from `_shared.md` rubric)

This is the "critical gap" — the one thing that would move the needle most.

### Step 4 — Generate the debrief report

```
Debrief Report — {date}
Target: {company} {role} ({level})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sessions analyzed: {N} (last {N} days)

Score Trend:
  Mock:           {avg}/5  ({trend: ↑ ↓ →})
  System Design:  {avg}/5  ({trend})
  Behavioral:     {avg}/5  ({trend})

Most flagged weak areas:
  1. {area} — flagged in {N}/{total} sessions
  2. {area} — flagged in {N}/{total} sessions
  3. {area}

CRITICAL GAP: {area}
  Why it matters: {this is a {weight}% weight pillar at {level}}
  Pattern: {what specifically keeps going wrong — e.g., "jumps to solution before clarifying requirements"}
  Fix: {concrete action — specific resource or drill}

What's improving:
  + {area} — was 2.1 avg two weeks ago, now 3.4

Recommended next 3 sessions:
  1. /prep drill {critical-gap-domain}     ← do this today
  2. /prep mock {domain} {company}         ← focus on {critical gap}
  3. /prep system-design "{topic}"         ← practice {specific scenario}

Story bank status:
  {N} stories in bank
  Missing themes: {list themes not covered}
  → /prep behavioral {company} to fill gaps
```

### Step 5 — Update study plan
If `data/plan-*.md` exists, append a "Week N debrief" section with the current gap analysis.
