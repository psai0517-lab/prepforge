# PrepForge

> AI-powered interview preparation skill for Claude Code. Mock interviews, system design rounds, behavioral practice, and study plans — calibrated by company, role, and seniority level.

Built on [Claude Code](https://claude.ai/code). No web app. No subscriptions. Everything runs in your terminal.

---

## What it does

| Command | What you get |
|---------|-------------|
| `/prep plan apple data-engineer staff` | Personalized study plan with timeline, topic weights, and weekly milestones |
| `/prep mock spark-internals apple` | Scored mock interview with Apple's interviewer persona |
| `/prep system-design "design a deletion system at scale" netflix` | Full 45-min system design round with rubric scoring |
| `/prep behavioral amazon` | STAR+R behavioral practice mapped to Amazon's 14 Leadership Principles |
| `/prep drill kafka` | Rapid-fire concept drills on Kafka internals |
| `/prep debrief` | Gap analysis across all your sessions — what to focus on next |
| `/prep ingest` | Add real interview experiences from 1point3acres or Blind |

---

## Setup

### 1. Install Claude Code
```bash
npm install -g @anthropic-ai/claude-code
```

### 2. Clone this repo
```bash
git clone https://github.com/psai0517-lab/prepforge
cd prepforge
```

### 3. Set up your profile
```bash
cp templates/profile.example.yml data/profile.yml
# Edit data/profile.yml with your background and target roles
```

Or skip this step — just run `/prep` and the skill will guide you through onboarding.

### 4. Start Claude Code
```bash
claude
```

Then invoke the skill:
```
/prep plan netflix data-engineer-5 staff
```

---

## Company Coverage

Domain profiles (interview loop structure, tech stack, interviewer persona, real questions) are included for:

| Company | Role | Level |
|---------|------|-------|
| Apple | Data Engineer | ICT4–ICT5 (Senior / Staff) |
| Netflix | Data Engineer | L5–L6 (Staff) |
| Amazon | Data Engineer | L5–L6 (Senior / Staff) |
| Google | Data Engineer / SWE | L5–L6 (Senior / Staff) |

Adding a new company: create `domain-profiles/{company}-{role}.md` following the existing format.

---

## Architecture

```
prepforge/
├── .claude/skills/prep/SKILL.md   # skill entrypoint + command router
├── modes/                          # execution logic per command
│   ├── _shared.md                  # level calibration + scoring rubrics + personas
│   ├── plan.md
│   ├── mock.md
│   ├── system-design.md
│   ├── behavioral.md
│   ├── drill.md
│   ├── debrief.md
│   └── ingest.md
├── domain-profiles/                # company + role knowledge bases
├── scripts/session_manager.py      # deterministic state management
├── data/                           # your data (gitignored)
│   ├── profile.yml
│   ├── tracker.md
│   ├── story-bank.md
│   └── history/
└── templates/                      # starter files
```

**Your data lives in `data/` and is gitignored.** The system layer (`modes/`, `domain-profiles/`, `scripts/`) can be updated without touching your progress.

---

## Design Principles

**Level calibration is everything.** The system distinguishes between Junior, Mid, Senior, Staff, and Principal bars — and maps company-specific levels (ICT5, L6, L7) to a universal rubric. A Staff interview at Apple is not a Senior interview at a startup.

**Deterministic state, not conversational memory.** Session scores and weak areas are tracked in `data/tracker.md` via `session_manager.py`. Progress persists across conversations.

**Persona-matched simulation.** Apple's interviewer is terse and technically deep. Netflix gives you a blank canvas and evaluates independent judgment. Amazon enforces STAR format with a Bar Raiser. The mock sessions feel different because they're designed to.

**Build in public.** If you're targeting AI/Data Engineering roles, this repo is itself a portfolio artifact. Fork it, customize it, and share your version.

---

## Contributing

Add domain profiles, improve question databases, or refine mode logic. See `domain-profiles/apple-data-engineer.md` as the reference format for new profiles.

---

## Credits

Architecture based on concepts from:
- [career-ops](https://github.com/santifer/career-ops) — Santiago Fernandez
- [StaffEng](https://staffeng.com) — Staff-plus interview calibration research
- [Amazon Builder's Library](https://aws.amazon.com/builders-library/) — Engineering practices
- Netflix, Apple, and Google engineering blogs
