# Mode: system-design — Full System Design Round

Simulate a complete 45-minute system design interview with interactive rubric scoring.

## Inputs
- `topic` — the design prompt (e.g., "design a data deletion system at scale", "design a real-time recommendation engine")
- `company` — target company for persona + expectations (optional)
- `data/profile.yml` — target level

## Session Structure (45 minutes simulated)

### Phase 1 — Requirements Clarification (5 min)
The interviewer presents the prompt and waits. The candidate must ask clarifying questions before designing anything.

**What to evaluate:**
- Did they ask about scale? (DAU, QPS, data volume)
- Did they ask about consistency vs availability tradeoff?
- Did they scope the problem before jumping to solutions?
- Did they identify the hardest parts of the problem?

**Staff+ bar:** Must ask at least 3 non-obvious clarifying questions. "How many users?" is obvious. "What's the acceptable staleness window for deletion propagation?" is not.

### Phase 2 — High-Level Design (10 min)
Candidate proposes a high-level architecture. Interviewer listens and asks one probing question.

**What to evaluate:**
- Clear separation of concerns (ingestion, processing, storage, serving)
- Named the right components for the problem (not generic boxes)
- Identified the central technical challenge immediately

### Phase 3 — Deep Dive (20 min)
Interviewer picks the hardest component and asks to go deep. Follows up with:
- "What happens when this service goes down?"
- "How do you handle duplicate events?"
- "Walk me through the data model"
- "How do you test this?"
- "What would you cut for v1?"

### Phase 4 — Bottlenecks and Scale (5 min)
"Your system needs to handle 10x traffic in 6 months. What breaks first and how do you fix it?"

### Phase 5 — Wrap-Up (5 min)
"If you had 6 more months, what would you change about this design?"

---

## Scoring Rubric (System Design specific)

| Dimension | 5 | 3 | 1 |
|-----------|---|---|---|
| Requirements | Identified all critical constraints proactively | Got there with prompting | Jumped to solution immediately |
| Breadth | Covered all major components coherently | Missed 1-2 components | Incomplete high-level design |
| Depth | Demonstrated production-grade knowledge of at least one component | Reasonable depth with some hand-waving | Surface-level throughout |
| Tradeoffs | Named specific tradeoffs with real consequences | General "there are tradeoffs" | No tradeoffs mentioned |
| Scale | Quantified bottlenecks and specific mitigation | Identified bottlenecks vaguely | Didn't consider scale |
| Communication | Clear narrative, easy to follow | Mostly clear, some jumps | Hard to follow |

**Staff+ modifier:** Add 1 point if the candidate challenged the premise of the prompt ("actually, I'd question whether we need a separate deletion system at all — here's why").

---

## Post-Session Output

```
System Design Round Complete — {topic}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Score: {X}/5 — {verdict}

Phase Scores:
  Requirements: {score} — {comment}
  High-Level Design: {score} — {comment}
  Deep Dive: {score} — {comment}
  Scale: {score} — {comment}

The thing that would have made this a 5:
  {specific observation}

Recommended reading:
  {1-2 specific resources for the gaps identified}

→ Run this design again in 1 week: /prep system-design "{topic}" {company}
```

Save transcript and score via `session_manager.py`.
