# Mode: drill — Rapid-Fire Concept Drills

Flash-card style sessions for concept reinforcement. Fast, targeted, no long explanations during the drill.

## Inputs
- `domain` — topic to drill (e.g., kafka, spark-internals, sql, distributed-systems, system-design-components)

## Supported Domains

| Domain | What it covers |
|--------|---------------|
| `kafka` | Partitioning, consumer groups, offsets, exactly-once, compaction, replication |
| `spark-internals` | DAG execution, shuffle, lineage, Catalyst optimizer, memory management, Tungsten |
| `spark-streaming` | Micro-batch vs continuous, watermarks, stateful ops, checkpointing |
| `flink` | Event time vs processing time, watermarks, state backends, exactly-once semantics |
| `sql` | Window functions, CTEs, query optimization, partitioning, indexing |
| `distributed-systems` | CAP theorem, consistency models, consensus protocols, failure modes |
| `data-modeling` | Kimball vs Inmon, star vs snowflake, SCD types, data vault |
| `system-design-components` | Load balancers, caches, message queues, CDNs, databases |
| `python-ds-algo` | Common patterns: two pointers, sliding window, BFS/DFS, dynamic programming |
| `behavioral-rapid` | Quick-fire LP/value questions — 30 seconds each |

## Session Flow

### Step 1 — Level check
Ask: "Quick check — are we drilling at [level from profile.yml] bar?" Adjust complexity if needed.

### Step 2 — Drill loop (10–15 questions)
For each question:
1. Ask the question
2. Wait for answer
3. Give instant feedback: ✓ Correct / ✗ Wrong + one-line correction
4. Move immediately to next question — no extended explanations during drill

**Keep the pace fast.** This is about pattern recognition and recall, not depth.

### Step 3 — Slow down on misses
If the candidate got a question wrong, flag it: "Marking this for review." After all questions, do a 2-minute deep dive on the top 2 misses.

---

## Sample Questions by Domain

### kafka
- "What happens when a Kafka consumer falls behind the log retention window?"
- "Explain the difference between at-least-once and exactly-once delivery in Kafka. How do you achieve exactly-once?"
- "A topic has 12 partitions. You add a consumer to a group that already has 12 consumers. What happens?"
- "What is log compaction and when would you use it?"
- "How does Kafka handle leader election when a broker fails?"

### spark-internals
- "What is a lineage graph and why can it cause a StackOverflowError?"
- "Explain the difference between a narrow and wide transformation. Give one example of each."
- "What does the Catalyst optimizer do with a DataFrame query before execution?"
- "When would you use `broadcast()` and what is the risk?"
- "What is Tungsten and what problem does it solve?"
- "Explain the difference between `cache()` and `persist(DISK_ONLY)`."
- "Why does `coalesce()` not cause a full shuffle but `repartition()` does?"

### distributed-systems
- "Explain the CAP theorem. Which two properties does a Kafka cluster prioritize?"
- "What is the difference between eventual consistency and strong consistency? Give a real-world example where each is appropriate."
- "What is a split-brain scenario? How do distributed systems prevent it?"
- "Explain the difference between a leader-follower and a leaderless replication model."
- "What is two-phase commit and why is it rarely used in modern distributed systems?"

---

## Post-Drill Summary

```
Drill Complete — {domain}
━━━━━━━━━━━━━━━━━━━━━━━

Score: {correct}/{total}
Time: ~{N} minutes

Correct: ✓ {N}
Incorrect: ✗ {N}

Concepts to review:
  - {concept}: {one-line explanation of the correct answer}
  - ...

→ Run again in 48h: /prep drill {domain}
→ Go deeper: /prep mock {domain} {company}
```
