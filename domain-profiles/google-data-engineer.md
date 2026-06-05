# Domain Profile: Google — Data Engineer / Software Engineer (Data) L5/L6

## Interview Loop Structure
- **Recruiter screen** (30 min)
- **Technical phone screen** (45 min): 1–2 coding problems
- **Onsite** (4–5 rounds):
  - 2x Coding (algorithmic, medium–hard, any language)
  - 1x System Design (distributed data system)
  - 1x Behavioral / "Googleyness" (leadership, collaboration, growth)
  - 1x Domain (data engineering specific: BigQuery, Dataflow, Pub/Sub, data modeling)

## Core Technologies
- **BigQuery** — columnar storage, partitioning, clustering, slot-based pricing, INFORMATION_SCHEMA
- **Apache Beam / Dataflow** — unified batch + streaming model, windowing, triggers, watermarks
- **Pub/Sub** — at-least-once delivery, subscription types, ordering guarantees
- **Apache Spark** — expected as a known tool, but Beam/Dataflow preferred in Google context
- **Spanner / Bigtable / Firestore** — when to use each; tradeoffs
- **SQL** — advanced: window functions, lateral joins, recursive CTEs, query plan analysis

## Google-Specific Nuances
- **Algorithmic rigor** — Google still values DS&A more than most companies at this level. Even for data engineering roles, expect a coding round with non-trivial algorithmic complexity.
- **Scale by default** — Google's scale means design decisions that are fine at 1M QPS fail at 1B QPS. Think in orders of magnitude.
- **Googliness** — intellectual humility, excitement about hard problems, collaboration without ego. Not "culture fit" — they genuinely test whether you engage with failure and uncertainty openly.
- **Structured Data teams** — Google's internal data infrastructure (Dremel, Colossus, Borg) informs their external products. Understanding the "why" behind BigQuery's design earns credibility.
- **Ambiguity in system design** — Google interviewers give minimal constraints. Asking good clarifying questions is a strong positive signal.

## Common Interview Questions
- "Design Google's event logging pipeline — billions of events per day, multiple downstream consumers, exactly-once guarantees."
- "How does BigQuery's columnar storage affect query performance? What's the impact of wide vs narrow schemas?"
- "Implement a sliding window average over a stream of numbers with configurable window size." (coding + streaming concepts)
- "Design a system to detect duplicate events in a high-throughput stream."
- "What are the tradeoffs between using Pub/Sub + Dataflow vs Kafka + Spark Streaming for a new pipeline?"
- "How do you handle late-arriving data in a Beam pipeline? What are the watermark tradeoffs?"
- "Design a data warehouse for Google Ads reporting — sub-second query latency, 10 trillion rows."

## Coding — What to Expect
Google values clean, efficient code with full edge case coverage:
- Start by clarifying constraints and examples
- State your approach and complexity before coding
- Write clean code (Google engineers will read it carefully)
- Test with edge cases at the end
- Common patterns: BFS/DFS, dynamic programming, two pointers, interval merging

## Behavioral — Googliness Signals
- "Tell me about a time you received critical feedback. How did you respond?"
- "Describe a project where you had to convince others to change direction."
- "When have you learned something that fundamentally changed how you approach a problem?"
- "Tell me about a failure. What did you learn?"

## Interviewer Persona
Collegial thought partner. Generous with hints — will guide you toward the answer if you're stuck. Wants to see your reasoning process, not just the answer. Will say "interesting — what if we added constraint X?" after you solve it. Expects you to engage with feedback as a collaborative refinement, not a correction.

## Red Flags
- Writing code without discussing the approach first
- Not analyzing time/space complexity
- Defensive reactions to follow-up questions
- Dismissing hints ("no, my approach is correct")
- System design without quantifying scale first

## Recommended Prep Resources
- "Designing Data-Intensive Applications" (Kleppmann) — essential
- "System Design Interview" (Alex Xu) — Vol 1 and 2
- Google's published papers: Dremel, Spanner, MapReduce, Bigtable
- LeetCode: focus on graphs, trees, dynamic programming (medium–hard)
- Apache Beam documentation — programming model, windowing
