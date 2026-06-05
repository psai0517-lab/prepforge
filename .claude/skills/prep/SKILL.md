---
name: prep
description: AI-powered interview preparation — study plans, mock interviews, system design, behavioral practice, drills, and debriefs. Calibrated by company, role, and seniority level.
argument-hint: "[command] [company] [role] [level]"
user-invocable: true
allowed-tools: Read, Write, Bash, WebSearch
---

# PrepForge — Interview Preparation Skill

## Command Routing

| Input | Mode |
|-------|------|
| (empty / no args) | `onboarding` — check setup, show menu |
| `plan <company> <role> <level>` | `plan` — generate personalized study plan |
| `mock [domain] [company]` | `mock` — interactive mock interview session |
| `system-design <topic> [company]` | `system-design` — full system design round |
| `behavioral [company]` | `behavioral` — STAR+R behavioral practice |
| `drill <domain>` | `drill` — rapid-fire concept flashcards |
| `debrief` | `debrief` — analyze session history, surface gaps |
| `ingest` | `ingest` — add real interview experiences to local DB |
| `profile` | `profile` — view or update your profile |

## Step 0 — Setup Check (run every session)

Before executing any command, silently verify:

1. Does `data/profile.yml` exist?
2. Does `data/tracker.md` exist?
3. Does `data/story-bank.md` exist?

If `data/profile.yml` is missing → enter **onboarding mode** before anything else.

If `data/tracker.md` or `data/story-bank.md` are missing → copy from `templates/` silently.

## Onboarding Mode

Guide the user through setup:

> "Welcome to PrepForge. Before we start, I need a few things:
> 1. What company and role are you targeting? (e.g., Apple Staff Data Engineer)
> 2. What's your current title and years of experience?
> 3. What are your top 3 technical strengths?
> 4. What gaps are you most worried about?
>
> I'll set up your profile and we can start immediately."

Create `data/profile.yml` from their answers (using `templates/profile.example.yml` as the schema).
Create `data/tracker.md` and `data/story-bank.md` from templates.

Then show the menu:

```
PrepForge — Ready

  /prep plan <company> <role> <level>   → Personalized study plan with timeline
  /prep mock [domain] [company]         → Mock interview session (scored)
  /prep system-design <topic>           → Full system design round with rubric
  /prep behavioral [company]            → STAR+R behavioral practice
  /prep drill <domain>                  → Rapid-fire concept drills
  /prep debrief                         → Gap analysis from session history
  /prep ingest                          → Add real interview Q&As to local DB

Tip: Start with /prep plan to get your roadmap, then /prep mock to test it.
```

## Context Loading by Mode

Load the following files before executing each mode:

| Mode | Files to load |
|------|--------------|
| `plan` | `data/profile.yml` + `modes/_shared.md` + `modes/plan.md` + matching `domain-profiles/{company}-{role}.md` (if exists) |
| `mock` | `data/profile.yml` + `data/tracker.md` + `modes/_shared.md` + `modes/mock.md` + matching domain profile |
| `system-design` | `data/profile.yml` + `modes/_shared.md` + `modes/system-design.md` + matching domain profile |
| `behavioral` | `data/profile.yml` + `data/story-bank.md` + `modes/_shared.md` + `modes/behavioral.md` + matching domain profile |
| `drill` | `modes/_shared.md` + `modes/drill.md` |
| `debrief` | `data/tracker.md` + `data/history/` (last 5 sessions) + `modes/debrief.md` |
| `ingest` | `modes/ingest.md` + `data/questions/` |

Execute instructions from the loaded mode file.
