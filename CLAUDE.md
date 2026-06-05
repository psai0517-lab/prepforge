# PrepForge — AI Interview Preparation Skill

## What this is

PrepForge is a Claude Code skill that turns your terminal into an adaptive interview simulation engine. It covers everything: study plans, mock technical interviews, system design rounds, behavioral practice, drill sessions, and post-session debriefs — all calibrated to the specific company, role, and seniority level you're targeting.

## Skill Activation

The skill lives in `.claude/skills/prep/SKILL.md`. In any Claude Code session inside this directory, invoke it with:

```
/prep plan apple data-engineer staff
/prep mock spark-internals
/prep system-design "design a data deletion system at scale"
/prep behavioral netflix
/prep drill kafka
/prep debrief
```

## Data Contract

**User Layer (never auto-updated — your data lives here):**
- `data/profile.yml` — your background, target roles, level, and comp expectations
- `data/tracker.md` — session history and scores
- `data/story-bank.md` — your STAR+R behavioral stories
- `data/history/` — raw session transcripts

**System Layer (safe to update):**
- `modes/` — execution logic for each command
- `domain-profiles/` — company + role knowledge bases
- `scripts/` — deterministic state management scripts
- `templates/` — starter files for new users

## First Run

If `data/profile.yml` doesn't exist, run `/prep` with no arguments and the skill will guide you through onboarding before doing anything else.

## Design Principles

1. **Level calibration is everything.** A Staff interview at Apple is not a Senior interview at a startup. Every evaluation adapts to the specific bar.
2. **Deterministic state, not conversational memory.** Progress is tracked in files, not inferred from chat history.
3. **Persona-matched simulation.** The mock interviewer's tone, pacing, and focus match the target company's documented culture.
4. **Build in public.** If you're targeting AI/Data Engineering roles, this repo itself is a portfolio artifact.
