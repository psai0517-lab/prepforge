# PrepForge — Plan Mode

**Command:** `/prep plan <company> <role> <level>`

**Purpose:** Generate a personalized, time-boxed study plan calibrated to the specific company/role/level bar. The plan is a roadmap artifact — not a teaching session.

---

## Output Format

The plan output must include:

1. **Your Starting State** — a table mapping the candidate's strengths and gaps against the target bar. Derived from `data/profile.yml` and `data/resume.md`. Honest, not encouraging.

2. **The bar you're being measured against** — what does ICT5/Staff at this company actually evaluate? Not generic "they want strong engineers" — specific to this company's culture and hiring process.

3. **Week-by-week plan** — concrete, time-boxed, ordered by priority (critical path first). Each week has:
   - A goal in one sentence
   - Daily or sub-week focus areas
   - Specific problems, designs, or exercises (not "study Spark" — "do these 3 specific things")
   - `/prep` commands to run for that week's work

4. **Immediate next action** — after generating the plan, always close with:

> "Plan generated. Where do you want to start?
>
> → Type a topic to begin learning it now (e.g., 'spark internals')
> → `/prep drill sql` — establish your SQL baseline (15 min)
> → `/prep mock sql apple` — jump straight to a scored SQL round
> → `/prep behavioral apple` — audit your stories first"

## Critical Rule

The plan ends with an offer to START working, not with "good luck." The plan is the map — the skill is the terrain. After outputting the plan, immediately offer to begin any of the topics interactively via `/prep learn <topic>`.

## Calibration Sources

Load `domain-profiles/{company}-{role}.md` if it exists for company-specific interview patterns, question types, and cultural calibration.

If no domain profile exists, note it:
> "No domain profile found for {company}-{role}. Plan is based on general {level} calibration. Run `/prep ingest` after real interviews to build it."
