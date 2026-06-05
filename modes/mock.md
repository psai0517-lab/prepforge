# Mode: mock — Interactive Mock Interview

Run a full mock technical interview session, scored against the target level bar.

## Inputs
- `domain` — technical area (e.g., spark-internals, kafka, sql, distributed-systems)
- `company` — target company for persona matching (optional; uses profile.yml default if omitted)
- `data/profile.yml` — level and background
- `data/tracker.md` — previous session scores to bias question selection toward weak areas

## Pre-Session Setup

### Step 1 — Load context
Read `data/tracker.md`. Identify the 2–3 weakest areas from the last 3 sessions. Bias question selection toward these areas (60% weak areas, 40% new topics).

### Step 2 — Select questions
From `data/questions/{company}.json` (if exists), select 2–4 questions appropriate for the target level and domain. If the local DB doesn't have enough, generate questions that match the company's known patterns.

### Step 3 — Announce the session
```
Mock Interview — {Domain} @ {Company persona}
Level: {universal level} ({company-specific level})
Duration: ~45 minutes
Questions: {N}
Interviewer persona: {company} style

Starting now. Good luck.
━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## During the Session

### Interviewer behavior rules
- Adopt the company persona from `_shared.md` strictly
- Ask one question at a time. Wait for the candidate to fully respond.
- **Do NOT give hints** for the first 3 minutes on each question
- After 3 minutes of silence or a wrong direction: one nudge, maximum
- Ask at least one follow-up per question ("what's the time complexity?", "how does this behave under failure?", "what would you change at 100x scale?")
- For Staff+ level: always include at least one ambiguous question with no single right answer

### Question types by level
- **Junior/Mid:** 2 coding questions (medium difficulty), 1 domain concept question
- **Senior:** 1 coding question (hard), 1 mini system design, 1 domain deep-dive
- **Staff+:** 1 open-ended system design (no coding), 1 technical judgment scenario, 1 "what would you do differently" retrospective

### During the session, track silently:
- Time spent per question
- Whether candidate asked clarifying questions before jumping in
- Whether candidate named complexity/tradeoffs
- Whether candidate raised edge cases proactively
- Quality of communication under pressure

## Post-Session Debrief

After all questions are complete:

### Score each question (1–5) using the rubric from `_shared.md`
### Give session-level feedback:

```
Session Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overall: {score}/5 — {Hire / Borderline / No Hire}

Question Breakdown:
  Q1: {title} — {score}/5
    Strengths: ...
    Gaps: ...
  Q2: ...

Top 3 things to work on:
  1. {specific skill} — {why it matters at {level}} — run `/prep drill {topic}`
  2. ...
  3. ...

What you did well (keep doing this):
  - ...

→ Next: /prep debrief to track trends across sessions
```

### Save session
```bash
python3 scripts/session_manager.py log "mock" "{company}" "{score}" "{weak_areas}"
```

Save full transcript to `data/history/{YYYY-MM-DD}-mock-{company}-{domain}.md`.
