# Mode: plan — Personalized Study Plan

Generate a structured, time-boxed preparation roadmap calibrated to the candidate's target company, role, and level.

## Inputs
- `company` — target company (e.g., Apple, Netflix, Google, Amazon)
- `role` — job function (e.g., data-engineer, backend-engineer, ml-engineer)
- `level` — target seniority (e.g., senior, staff, L5, ICT5)
- `data/profile.yml` — candidate background, strengths, gaps

## Execution

### Step 1 — Normalize level
Map the input level to the universal level (Junior/Mid/Senior/Staff/Principal) using the table in `_shared.md`. All subsequent calibration uses the universal level.

### Step 2 — Load domain profile
Check if `domain-profiles/{company}-{role}.md` exists. If yes, load it. If not, use WebSearch to gather:
- Core technologies for this role at this company
- Known interview loop structure (number of rounds, types)
- Company-specific focus areas and red flags

### Step 3 — Compute topic weights
Based on role + level, assign weights to preparation pillars:

| Pillar | Junior | Mid | Senior | Staff | Principal |
|--------|--------|-----|--------|-------|-----------|
| Coding / DS&A | 50% | 40% | 25% | 10% | 5% |
| System Design | 10% | 20% | 35% | 30% | 25% |
| Domain Depth | 20% | 20% | 20% | 25% | 25% |
| Behavioral / Leadership | 10% | 10% | 15% | 30% | 40% |
| Company Culture / Values | 10% | 10% | 5% | 5% | 5% |

Cross-reference with the candidate's `gaps` in `profile.yml` — gaps in high-weight pillars get extra study time.

### Step 4 — Build the study plan

Output a structured plan with:

1. **Timeline** — suggested total prep time (e.g., 4 weeks for a Senior role at FAANG), broken into weekly phases
2. **Week-by-week breakdown** — specific topics, resources, and practice goals per week
3. **Mock schedule** — when to run `/prep mock` and `/prep system-design` sessions
4. **Domain-specific deep dives** — topics unique to this company + role
5. **Behavioral story gaps** — which STAR themes are missing from `story-bank.md`

### Output format

```
Study Plan: {Company} — {Role} ({Level})
Generated: {date}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total prep time: {N} weeks
Your profile: Strong in {strengths}, gaps in {gaps}

PHASE 1 — FOUNDATION ({weeks 1-N})
Topics: ...
Resources: ...
Daily target: ...

PHASE 2 — DEPTH ({weeks N-M})
...

PHASE 3 — SIMULATION ({final week})
  - 2x /prep mock sessions
  - 1x /prep system-design
  - 1x /prep behavioral
  - /prep debrief after each

CRITICAL FOCUS AREAS (based on your gaps):
  1. {gap} — {why it matters for this role} — {specific resource}
  ...

BEHAVIORAL STORIES NEEDED:
  - {theme}: no story found in story-bank.md
  ...

→ Start with: /prep drill {highest-weight-gap-topic}
```

### Step 5 — Save plan
Write the plan to `data/plan-{company}-{role}-{YYYY-MM-DD}.md`.
