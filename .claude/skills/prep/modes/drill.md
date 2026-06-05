# PrepForge — Drill Mode

**Command:** `/prep drill <domain>`

**Purpose:** Rapid-fire, timed concept drills. Like flashcards but adaptive — harder when you get it right, easier when you miss.

---

## Session Setup

Open with:

> "Starting [domain] drill. I'll ask questions one at a time. Answer as you would in an interview — out loud or in text. I'll score each one and adapt the difficulty.
>
> Ready? First question:"

Then immediately ask the first question. No warm-up, no preamble.

---

## Drill Protocol

**Each round:**
1. State the question (20 words or less — punchy, like a real interviewer)
2. Wait for the user's answer
3. Score it: ✓ (correct), ~ (partial), ✗ (wrong)
4. Give a 1–2 sentence correction or affirmation
5. Next question — harder if ✓, same level if ~, easier if ✗

**Pacing:** No long explanations mid-drill. Save depth for after the drill ends or if the user asks to pause.

**End condition:** User says "stop" or "debrief" OR after 15 questions.

At the end: show a scorecard, identify the weakest pattern, suggest a `/prep learn <topic>` follow-up.

---

## Question Banks by Domain

### SQL

Easy:
- "What's the difference between WHERE and HAVING?"
- "When does a LEFT JOIN produce more rows than the left table?"
- "What does DISTINCT do to performance?"

Medium:
- "Write a query to find the second-highest salary in a table."
- "What's the difference between RANK() and DENSE_RANK()? Give me an example where they return different results."
- "You have a sessions table with start_time and end_time. Write a query to find overlapping sessions."

Hard:
- "Write a recursive CTE to flatten a self-referencing org hierarchy table."
- "Explain why `WHERE date_col = '2026-01-01'` on a partitioned table might NOT prune partitions. How do you fix it?"
- "Given a funnel table with user_id, step, and timestamp — write a query to find users who completed steps 1→2→3 in order within 7 days."

### Spark

Easy:
- "What's the difference between a transformation and an action in Spark?"
- "What does `.cache()` do? When would you NOT use it?"
- "What's a stage boundary in Spark? What causes one?"

Medium:
- "What's the difference between `repartition(n)` and `coalesce(n)`? When does each make sense?"
- "You have a skewed groupBy — 80% of keys are the same value. What's your fix?"
- "What's the difference between `reduceByKey` and `groupByKey`? Why does one perform better?"

Hard:
- "Walk me through what happens at the physical level when Spark executes a sort-merge join on two 500GB tables."
- "Your Spark streaming job has growing lag. Walk me through your diagnostic process."
- "Explain Tungsten's off-heap memory management and why it exists."

### Kafka

Easy:
- "What's a consumer group? Why does it exist?"
- "What's the difference between a topic and a partition?"
- "What does `acks=all` guarantee? What's the tradeoff?"

Medium:
- "What's log compaction? When would you enable it?"
- "Explain exactly-once semantics in Kafka. What components must ALL be configured correctly for it to work end-to-end?"
- "What's ISR? What happens when a replica falls out of ISR?"

Hard:
- "You have a Kafka consumer with growing lag that suddenly catches up and then falls behind again in a cycle. What are three possible root causes?"
- "Compare MirrorMaker 2 vs Confluent Replicator for cross-region Kafka replication. What are the ordering guarantees of each?"

### DSA (Python)

Easy:
- "Implement a function to find the two numbers in an array that sum to a target. O(n) time."
- "What data structure would you use to implement an LRU cache? Why?"
- "When would you use a heap instead of sorting the whole array?"

Medium:
- "Write a function to merge two sorted arrays without using sort(). What's the time complexity?"
- "Given a list of meeting intervals, find the minimum number of conference rooms required."
- "Implement a stack that supports push, pop, and getMin() all in O(1)."

Hard:
- "Write BFS to find the shortest path in a grid with obstacles."
- "Given a stream of integers, find the median after each new integer arrives. Code it."

### Data Modeling

Easy:
- "What's the grain of a fact table? Why does it matter?"
- "What's a slowly changing dimension? Give me an example."
- "What's the difference between a star schema and a snowflake schema?"

Medium:
- "When would you choose SCD Type 2 over SCD Type 1? What's the storage tradeoff?"
- "What are Hubs, Links, and Satellites in Data Vault? Give me an example Hub for an App Store model."
- "What's the Medallion architecture? When is Bronze→Silver→Gold insufficient?"

Hard:
- "Design the grain for a fact table that tracks App Store downloads, where one download can span multiple devices for the same user. What are the tradeoffs?"
- "You're modeling a data deletion system in a dimensional model. How do you handle GDPR erasure requests when you have SCD Type 2 history rows for a deleted user?"

---

## Scorecard Format

```
Drill Complete — [Domain]

✓  [count] correct
~  [count] partial
✗  [count] missed

Strongest:  [pattern or concept]
Weakest:    [pattern or concept]

→ Run `/prep learn [weakest topic]` to go deep on this
→ Run `/prep drill [domain]` again to re-test
```
