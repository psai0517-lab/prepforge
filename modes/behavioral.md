# Mode: behavioral — STAR+R Behavioral Practice

Practice behavioral questions mapped to target company values, scored on STAR+R quality.

## Inputs
- `company` — target company for value mapping (optional; defaults to first in profile.yml)
- `data/profile.yml` — background and target role
- `data/resume.md` — full work history (if exists; used to surface story candidates from actual experience)
- `data/story-bank.md` — existing stories to reference and improve

## Company Value Mappings

### Amazon — 14 Leadership Principles
Focus on: Ownership, Customer Obsession, Dive Deep, Bias for Action, Deliver Results, Have Backbone/Disagree and Commit, Hire and Develop the Best

### Netflix
Focus on: Stunning colleagues, Freedom and responsibility, Context not control, Highly aligned loosely coupled, Judgment over process, Courage

### Apple
Focus on: Deep expertise, Attention to craft, Privacy and user trust, Long-term thinking, Ownership of outcomes

### Google
Focus on: Googliness (intellectual humility, fun, ambition), Impact at scale, Collaboration, Technical leadership

---

## Session Flow

### Step 1 — Warm-up question
Start with one easy question to calibrate the candidate's natural storytelling style.

### Step 1b — Resume mining (if `data/resume.md` exists)
Before selecting questions, scan the resume for story candidates:
- Each role with a quantified achievement is a potential STAR story
- Flag roles or projects that map to gap themes in `story-bank.md`
- Prompt the candidate: "I see you led a Snowflake migration at Rivian with zero data loss. That's a strong 'Ownership' story — want to practice it?"

This surfaces stories the candidate has but hasn't formalized yet.

### Step 2 — Core session (4–6 questions)
Select questions from two categories:
1. **Gap coverage:** themes not found in `story-bank.md` (the candidate needs new stories here)
2. **Story sharpening:** themes where stories exist but the STAR+R quality is weak (no quantified Result, no Reflection)

### Step 3 — Live coaching
After each answer:
- Score S / T / A / R / Reflection individually (1–3 scale)
- Flag missing elements immediately: "You didn't quantify the result — what was the actual impact?"
- If the story scores 2+ on all dimensions, add it to `story-bank.md`

### Scoring per story

| Element | 3 — Strong | 2 — Adequate | 1 — Weak |
|---------|-----------|--------------|----------|
| Situation | Specific context, stakes clear | Vague context | No context given |
| Task | YOUR role is clear | Unclear if individual or team | Not stated |
| Action | 3+ concrete steps, "I" not "we" | Vague actions | No specifics |
| Result | Quantified outcome | Stated but not quantified | No result given |
| Reflection | Insight or lesson extracted | Mentioned learning vaguely | None |

### Amazon-specific rule
Every story must survive the "Bar Raiser test":
- Can it be challenged? ("Why didn't you escalate sooner?")
- Does it show independent judgment under pressure?
- Is the result unambiguously positive for the customer or business?

---

## Post-Session Output

```
Behavioral Session Complete — {company}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Stories practiced: {N}
Added to story-bank: {N}

Themes covered today:
  ✓ {theme} — score {X}/5
  ✗ {theme} — needs work

Story bank gaps remaining:
  - {missing theme} — critical for {company}
  - ...

Your strongest story: "{title}" — use this as your opener
Your weakest story: "{title}" — needs a quantified result

Next: /prep behavioral {company} (focus on gap themes)
```

Append new/improved stories to `data/story-bank.md`.
Save session via `session_manager.py`.
