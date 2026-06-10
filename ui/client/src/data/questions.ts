export type Difficulty = "easy" | "medium" | "hard";

export type Domain =
  | "sql"
  | "spark"
  | "kafka"
  | "dsa"
  | "data-modeling";

export interface Question {
  id: string;
  domain: Domain;
  difficulty: Difficulty;
  question: string;
  answer: string;
}

export const DOMAIN_META: Record<Domain, { label: string; color: string }> = {
  sql: { label: "SQL", color: "text-blue-500" },
  spark: { label: "Spark Internals", color: "text-orange-500" },
  kafka: { label: "Kafka", color: "text-purple-500" },
  dsa: { label: "DSA (Python)", color: "text-green-500" },
  "data-modeling": { label: "Data Modeling", color: "text-rose-500" },
};

export const questions: Question[] = [
  // ── SQL ──────────────────────────────────────────────────────────────────
  {
    id: "sql-e1",
    domain: "sql",
    difficulty: "easy",
    question: "What's the difference between WHERE and HAVING?",
    answer:
      "WHERE filters rows before aggregation; HAVING filters groups after aggregation. Use WHERE for row-level conditions, HAVING only when filtering on an aggregated value like COUNT(*) or SUM(amount).",
  },
  {
    id: "sql-e2",
    domain: "sql",
    difficulty: "easy",
    question: "When does a LEFT JOIN produce more rows than the left table?",
    answer:
      "When the right table has multiple rows matching a single left row — each match generates a separate output row. Always check for fan-out by counting before and after; it's the most common cause of inflated aggregates.",
  },
  {
    id: "sql-e3",
    domain: "sql",
    difficulty: "easy",
    question: "What does DISTINCT do to performance?",
    answer:
      "DISTINCT forces a sort or hash-dedup pass over the full result set — O(n log n) or O(n) depending on engine. Avoid it when you can prevent duplicates upstream with better join conditions. Its presence often signals a fan-out bug in the query logic.",
  },
  {
    id: "sql-m1",
    domain: "sql",
    difficulty: "medium",
    question: "Write a query to find the second-highest salary. Handle ties correctly.\n\nTable: employees(id INT, name VARCHAR, salary INT)\nSample: (1,'Alice',100), (2,'Bob',100), (3,'Carol',80), (4,'Dave',60)\nExpected: 80",
    answer:
      "Use DENSE_RANK: SELECT salary FROM (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rk FROM employees) t WHERE rk = 2 LIMIT 1. The subquery approach (MAX where salary < MAX) breaks when multiple employees share the maximum — DENSE_RANK handles ties correctly.",
  },
  {
    id: "sql-m2",
    domain: "sql",
    difficulty: "medium",
    question: "What's the difference between RANK() and DENSE_RANK()? When do they return different results?",
    answer:
      "RANK() leaves gaps after ties: two rows at rank 1 make the next row rank 3. DENSE_RANK() never gaps: next row after two rank-1 ties is rank 2. With salaries [100, 100, 80]: RANK gives 1,1,3; DENSE_RANK gives 1,1,2. Use DENSE_RANK when you want 'the Nth distinct value.'",
  },
  {
    id: "sql-m3",
    domain: "sql",
    difficulty: "medium",
    question: "Write a query to find all overlapping session pairs.\n\nTable: sessions(id INT, user_id INT, start_time TIMESTAMP, end_time TIMESTAMP)\nSample: (1, u1, 10:00, 10:30), (2, u1, 10:15, 10:45), (3, u1, 11:00, 11:30)\nExpected: rows (1,2) — they overlap. (1,3) and (2,3) do not.",
    answer:
      "Self-join on overlap: SELECT a.id, b.id FROM sessions a JOIN sessions b ON a.id < b.id AND a.start_time < b.end_time AND b.start_time < a.end_time. The a.id < b.id prevents returning (A,B) and (B,A) as separate pairs. Two sessions overlap when neither ends before the other starts.",
  },
  {
    id: "sql-h1",
    domain: "sql",
    difficulty: "hard",
    question: "Write a recursive CTE to flatten a self-referencing employee org hierarchy.\n\nTable: employees(id INT, name VARCHAR, manager_id INT nullable)\nSample: (1,'CEO',NULL), (2,'VP Eng',1), (3,'Staff DE',2), (4,'Sr DE',2), (5,'CTO',1)\nExpected: every employee with their depth (CEO=0, VP/CTO=1, Staff/Sr=2), ordered by depth.",
    answer:
      "WITH RECURSIVE org AS (SELECT id, name, manager_id, 0 AS depth FROM employees WHERE manager_id IS NULL UNION ALL SELECT e.id, e.name, e.manager_id, o.depth+1 FROM employees e JOIN org o ON e.manager_id = o.id) SELECT * FROM org ORDER BY depth. Anchor = root (no manager); recursive member joins each employee to its parent.",
  },
  {
    id: "sql-h2",
    domain: "sql",
    difficulty: "hard",
    question: "Explain why `WHERE date_col = '2026-01-01'` on a partitioned table might NOT prune partitions. How do you fix it?",
    answer:
      "Pruning fails when: (1) column type mismatches partition key type (string vs date cast); (2) a function wraps the column — WHERE DATE(ts) = ... prevents pruning; (3) optimizer statistics are stale. Fix: ensure types match, use the raw partition key without functions, run ANALYZE, verify with EXPLAIN PARTITIONS that pruning actually fires.",
  },
  {
    id: "sql-h3",
    domain: "sql",
    difficulty: "hard",
    question: "Find users who completed steps 1→2→3 in order within 7 days of their step 1.\n\nTable: funnel(user_id INT, step INT, ts TIMESTAMP)\nSample:\n  user 1: step1@day0, step2@day3, step3@day6  → include\n  user 2: step1@day0, step3@day2, step2@day5  → exclude (wrong order)\n  user 3: step1@day0, step2@day2, step3@day10 → exclude (outside 7 days)",
    answer:
      "SELECT s1.user_id FROM funnel s1 JOIN funnel s2 ON s1.user_id=s2.user_id AND s2.step=2 AND s2.ts>s1.ts JOIN funnel s3 ON s1.user_id=s3.user_id AND s3.step=3 AND s3.ts>s2.ts WHERE s1.step=1 AND s3.ts <= s1.ts + INTERVAL '7 days'. If users can repeat steps, add MIN() subqueries to capture the earliest occurrence of each step — otherwise fan-out inflates results.",
  },

  // ── SPARK ─────────────────────────────────────────────────────────────────
  {
    id: "spark-e1",
    domain: "spark",
    difficulty: "easy",
    question: "What's the difference between a transformation and an action in Spark?",
    answer:
      "Transformations (filter, map, groupBy) are lazy — they build a DAG but run nothing. Actions (collect, count, write) trigger DAG execution. This allows Spark to optimize the full plan before running a single task.",
  },
  {
    id: "spark-e2",
    domain: "spark",
    difficulty: "easy",
    question: "What does .cache() do? When would you NOT use it?",
    answer:
      "cache() persists the DataFrame in executor memory (MEMORY_AND_DISK by default). Don't use it when: (1) the DataFrame is read only once — no reuse benefit; (2) the data exceeds executor memory — spill to disk may cost more than recomputing; (3) in streaming — data changes between microbatches.",
  },
  {
    id: "spark-e3",
    domain: "spark",
    difficulty: "easy",
    question: "What's a stage boundary in Spark? What causes one?",
    answer:
      "A stage boundary is where Spark must shuffle data between executors. Within a stage, data stays local (narrow transformations). Wide transformations — groupBy, join, repartition, sortBy — require redistributing data by key, creating a new stage. Stage boundaries are where most Spark performance problems originate.",
  },
  {
    id: "spark-m1",
    domain: "spark",
    difficulty: "medium",
    question: "What's the difference between repartition(n) and coalesce(n)? When does each make sense?",
    answer:
      "repartition(n) does a full shuffle — produces exactly n evenly distributed partitions. Use when increasing partition count or fixing skew. coalesce(n) merges partitions without a shuffle — can only reduce count and may produce uneven sizes. Use coalesce only to reduce partitions before writing output to avoid many small files.",
  },
  {
    id: "spark-m2",
    domain: "spark",
    difficulty: "medium",
    question: "You have a skewed groupBy — 80% of keys are the same value. What's your fix?",
    answer:
      "Salt the hot key: add a random suffix (0..N) before groupBy, aggregate, strip the salt, aggregate again. Alternative: if the post-aggregation result is small, broadcast it. In Spark 3.x, enable AQE (spark.sql.adaptive.enabled=true) — it detects skew automatically and splits hot partitions. AQE is the lowest-friction fix for most production skew.",
  },
  {
    id: "spark-m3",
    domain: "spark",
    difficulty: "medium",
    question: "What's the difference between reduceByKey and groupByKey? Why does one perform better?",
    answer:
      "groupByKey shuffles all values to the reducer first, then applies the function — maximum data movement. reduceByKey runs a combiner on each partition before the shuffle, drastically reducing network transfer. For commutative, associative ops (sum, count, max), always use reduceByKey. groupByKey is only correct when you need the full value list per key and can't pre-aggregate.",
  },
  {
    id: "spark-h1",
    domain: "spark",
    difficulty: "hard",
    question: "Walk me through what happens physically when Spark executes a sort-merge join on two 500GB tables.",
    answer:
      "Both tables are shuffled by join key (shuffle write to local disk). Each executor then pulls its assigned key range from all other executors (shuffle read — full network transfer of both tables). Each executor sorts its portion of each table by join key, then merges the sorted runs linearly. OOM risk peaks during the sort phase. If one table is < broadcast threshold (~10MB), switch to broadcast join to eliminate the shuffle entirely.",
  },
  {
    id: "spark-h2",
    domain: "spark",
    difficulty: "hard",
    question: "Your Spark streaming job has growing lag. Walk me through your diagnostic process.",
    answer:
      "1) Check processing time vs trigger interval — if processing > interval, you're falling behind structurally. 2) Spark UI: look for skewed tasks (one task 10x slower than others = shuffle skew). 3) Check shuffle read/write bytes — excessive shuffle suggests missing repartition or broadcast opportunity. 4) GC time in executor logs — high GC = memory pressure, increase executor memory or tune G1GC settings. 5) Source throughput — check Kafka consumer lag metrics; if source burst exceeds consumer capacity, increase parallelism. 6) Checkpoint overhead — if checkpoint duration > batch interval, reduce checkpoint frequency or move to incremental checkpointing.",
  },
  {
    id: "spark-h3",
    domain: "spark",
    difficulty: "hard",
    question: "Explain Tungsten's off-heap memory management and why it exists.",
    answer:
      "Tungsten moves data off the JVM heap into directly managed native memory using sun.misc.Unsafe. Motivation: JVM objects carry 2-5x overhead (headers, boxing, GC pressure). Tungsten stores data in compact binary row format, eliminates GC for large datasets, and enables cache-line-friendly algorithms. Result: less GC pause time, more predictable latency, often 2-10x better throughput on aggregation-heavy workloads. Tradeoff: off-heap memory leaks don't surface in JVM heap dumps — harder to debug.",
  },

  // ── KAFKA ─────────────────────────────────────────────────────────────────
  {
    id: "kafka-e1",
    domain: "kafka",
    difficulty: "easy",
    question: "What's a consumer group? Why does it exist?",
    answer:
      "A consumer group is a set of consumers that jointly consume a topic — each partition is owned by exactly one consumer in the group at a time. It exists to enable parallel consumption: N consumers process N partitions simultaneously. Different groups consume the same topic independently at their own offsets.",
  },
  {
    id: "kafka-e2",
    domain: "kafka",
    difficulty: "easy",
    question: "What's the difference between a topic and a partition?",
    answer:
      "A topic is a logical stream — what producers write to and consumers subscribe to. A partition is the physical unit of parallelism: each topic is split into N ordered, immutable append-only logs. Parallelism is bounded by partition count. Ordering is only guaranteed within a partition, never across partitions in a topic.",
  },
  {
    id: "kafka-e3",
    domain: "kafka",
    difficulty: "easy",
    question: "What does acks=all guarantee? What's the tradeoff?",
    answer:
      "acks=all means the leader only acknowledges a write after all in-sync replicas (ISR) have persisted it — prevents data loss if the leader dies immediately after a write. Tradeoff: latency. You wait for the slowest ISR replica. Pair with min.insync.replicas=2 for the strongest durability guarantee, at the cost of ~2-3x higher p99 write latency.",
  },
  {
    id: "kafka-m1",
    domain: "kafka",
    difficulty: "medium",
    question: "What's log compaction? When would you enable it?",
    answer:
      "Log compaction retains only the latest value per key, discarding superseded updates — unlike retention-by-time which deletes by age. Use it for changelog topics, KTable backing stores, or any case where you need current state per key rather than full event history (e.g., CDC streams, config updates). Don't use it if consumers need the full history of every event.",
  },
  {
    id: "kafka-m2",
    domain: "kafka",
    difficulty: "medium",
    question: "Explain exactly-once semantics in Kafka. What must be configured end-to-end?",
    answer:
      "EOS requires three layers: (1) Producer idempotence — enable.idempotence=true prevents duplicate writes on retry via sequence numbers; (2) Transactions — producer wraps reads+writes in an atomic transaction; (3) Consumer isolation — isolation.level=read_committed skips uncommitted records. If any layer is misconfigured, you get at-least-once at best. For Flink/Spark, the sink connector must also participate in the 2PC transaction protocol.",
  },
  {
    id: "kafka-m3",
    domain: "kafka",
    difficulty: "medium",
    question: "What's ISR? What happens when a replica falls out of ISR?",
    answer:
      "ISR (In-Sync Replicas) is the set of replicas caught up to the leader within replica.lag.time.max.ms. A replica falls out when it falls behind (network issue, slow disk, GC pause). With acks=all, writes only wait for ISR members — smaller ISR = faster writes, less durability. If ISR drops below min.insync.replicas, producers get NotEnoughReplicasException — writes fail by design to prevent silent data loss.",
  },
  {
    id: "kafka-h1",
    domain: "kafka",
    difficulty: "hard",
    question: "A Kafka consumer's lag grows, then suddenly catches up, then falls behind again — cyclically. Name three root causes.",
    answer:
      "1) Repeated rebalances: consumer exceeds max.poll.interval.ms during processing, triggering rebalance — lag builds during rebalance pause, then drains when it rejoins. 2) Bursty producer pattern: producers batch writes periodically (e.g., hourly jobs), consumer throughput matches average but not peak — lag spikes at burst, drains in quiet period. 3) Consumer GC pauses: long GC stalls cause poll timeout, triggering rebalance or simply blocking consumption — lag builds during pause, recovers after GC completes.",
  },
  {
    id: "kafka-h2",
    domain: "kafka",
    difficulty: "hard",
    question: "Compare MirrorMaker 2 vs Confluent Replicator for cross-region replication. What are the ordering guarantees?",
    answer:
      "Both replicate topics across clusters. MirrorMaker 2 (open source, Kafka Connect-based): at-least-once delivery, offset translation via a sync topic, preserves intra-partition order. Confluent Replicator (commercial): adds exactly-once via transactional replication, better offset translation, automatic topic/config sync. Neither preserves cross-partition ordering — that's a fundamental Kafka limitation regardless of replication tool. Choose MM2 for cost, Replicator when exactly-once and operational automation justify the license.",
  },

  // ── DSA ───────────────────────────────────────────────────────────────────
  {
    id: "dsa-e1",
    domain: "dsa",
    difficulty: "easy",
    question: "Implement two_sum(nums, target) in O(n) time.\n\nInput: nums=[2,7,11,15], target=9\nOutput: [0,1]  (nums[0]+nums[1]==9)\n\nAssume exactly one solution exists. Return the indices.",
    answer:
      "Use a hash map: iterate nums, for each n check if (target-n) is in seen; if yes return the pair, else add n to seen. One pass, O(n) time, O(n) space. def two_sum(nums, target): seen = {}; [seen.setdefault(n, i) for i, n in enumerate(nums)]; return next(([seen[target-n], i] for i, n in enumerate(nums) if target-n in seen and seen[target-n] != i), [])",
  },
  {
    id: "dsa-e2",
    domain: "dsa",
    difficulty: "easy",
    question: "What data structure would you use to implement an LRU cache? Why?",
    answer:
      "OrderedDict (Python) or doubly-linked list + hash map. The hash map gives O(1) key lookup. The linked list maintains access order and gives O(1) move-to-front and O(1) tail eviction. A plain dict lacks order; a heap gives O(log n) eviction instead of O(1). Python's OrderedDict wraps both — use it unless you need to implement from scratch.",
  },
  {
    id: "dsa-e3",
    domain: "dsa",
    difficulty: "easy",
    question: "When would you use a heap instead of sorting the full array?",
    answer:
      "When you need the top-K elements from N where K << N — a heap of size K runs in O(N log K) vs O(N log N) for full sort. Also for streaming top-K where you can't hold all elements in memory. Rule: if you need all elements sorted, sort. If you need only the K smallest/largest, use a heap.",
  },
  {
    id: "dsa-m1",
    domain: "dsa",
    difficulty: "medium",
    question: "Write merge(a, b) to merge two sorted arrays without using sort(). What's the time complexity?\n\nInput: a=[1,3,5], b=[2,4,6]\nOutput: [1,2,3,4,5,6]",
    answer:
      "Two-pointer: i=j=0, compare a[i] vs b[j], append the smaller, advance that pointer. O(m+n) time, O(m+n) space. def merge(a, b): res, i, j = [], 0, 0; [res.append(a[i] if i<len(a) and (j>=len(b) or a[i]<=b[j]) else b[j]) or [0] for _ in range(len(a)+len(b))]; — cleaner with explicit while loop. Append remaining slice from whichever array has elements left.",
  },
  {
    id: "dsa-m2",
    domain: "dsa",
    difficulty: "medium",
    question: "Given a list of meeting intervals [start, end], find the minimum number of conference rooms required.\n\nInput: [[0,30],[5,10],[15,20]]\nOutput: 2\n(Meeting 1 overlaps with both 2 and 3, but 2 and 3 don't overlap with each other.)",
    answer:
      "Sort by start time. Use a min-heap of end times. For each meeting: if heap[0] <= meeting.start, pop (room freed). Push meeting.end. Heap size = rooms in use. Final heap size = minimum rooms needed. O(n log n). Key insight: you only need to know when the earliest-ending meeting finishes, not which specific room it was.",
  },
  {
    id: "dsa-m3",
    domain: "dsa",
    difficulty: "medium",
    question: "Implement a stack that supports push, pop, and getMin() all in O(1).",
    answer:
      "Maintain two stacks: main and min_stack. On push(x): push to main; if min_stack is empty or x <= min_stack[-1], push x to min_stack too. On pop: pop from main; if popped value == min_stack[-1], pop min_stack. getMin() = min_stack[-1]. O(1) all ops, O(n) space worst case.",
  },
  {
    id: "dsa-h1",
    domain: "dsa",
    difficulty: "hard",
    question: "Write BFS to find the shortest path from top-left to bottom-right in a grid (0=open, 1=blocked). Return path length, or -1 if no path.\n\nInput:\n[[0,0,0],\n [1,1,0],\n [0,0,0]]\nOutput: 5  (right→right→down→down→... shortest open path)",
    answer:
      "from collections import deque\ndef shortest_path(grid):\n    if not grid or grid[0][0]: return -1\n    R, C = len(grid), len(grid[0])\n    q, visited = deque([(0,0,1)]), {(0,0)}\n    while q:\n        r,c,d = q.popleft()\n        if r==R-1 and c==C-1: return d\n        for dr,dc in [(0,1),(0,-1),(1,0),(-1,0)]:\n            nr,nc = r+dr,c+dc\n            if 0<=nr<R and 0<=nc<C and not grid[nr][nc] and (nr,nc) not in visited:\n                visited.add((nr,nc)); q.append((nr,nc,d+1))\n    return -1\nBFS guarantees shortest path. Mark visited before enqueuing to prevent O(n²) duplicates.",
  },
  {
    id: "dsa-h2",
    domain: "dsa",
    difficulty: "hard",
    question: "Given a stream of integers, find the running median after each insertion. What's the time complexity?",
    answer:
      "Two heaps: max-heap (lower half) and min-heap (upper half). Insert: push to max-heap, then move max-heap top to min-heap. Rebalance: if min-heap larger, move its min back to max-heap — so sizes differ by at most 1. Median: if equal sizes, average both tops; if unequal, take top of larger heap. O(log n) per insert, O(1) query. The heap invariant ensures lower half's max ≤ upper half's min.",
  },

  // ── DATA MODELING ─────────────────────────────────────────────────────────
  {
    id: "dm-e1",
    domain: "data-modeling",
    difficulty: "easy",
    question: "What's the grain of a fact table? Why does it matter?",
    answer:
      "The grain is the precise definition of what one row represents — the most atomic level of measurement (e.g., 'one line item on one invoice,' not 'one invoice'). It determines what dimensions you can join, what aggregations are valid, and what questions you can answer. Mixing grains in one fact table causes incorrect aggregations — the most common data modeling error.",
  },
  {
    id: "dm-e2",
    domain: "data-modeling",
    difficulty: "easy",
    question: "What's a slowly changing dimension? Give an example.",
    answer:
      "A dimension whose attributes change infrequently over time. Example: a Customer dimension where address or plan tier changes occasionally. SCD Type 1 overwrites (no history). SCD Type 2 inserts a new row with effective start/end dates, preserving history. Use SCD Type 2 when you need to know what the attribute value was at transaction time.",
  },
  {
    id: "dm-e3",
    domain: "data-modeling",
    difficulty: "easy",
    question: "What's the difference between a star schema and a snowflake schema?",
    answer:
      "Star: dimension tables are denormalized — all attributes in one table, one join from fact to dimension. Snowflake: dimensions normalize into multiple related tables (Product → Category → Department). Star has better query performance (fewer joins) and worse storage efficiency. For analytical workloads, star schema wins — storage is cheap, joins are expensive.",
  },
  {
    id: "dm-m1",
    domain: "data-modeling",
    difficulty: "medium",
    question: "When would you choose SCD Type 2 over SCD Type 1? What's the storage tradeoff?",
    answer:
      "SCD Type 2 when historical accuracy matters — e.g., 'what was the customer's plan tier at purchase time?' SCD Type 1 when only current state matters. Storage tradeoff: Type 2 multiplies rows by the number of changes per entity — a customer who changes plans 5 times creates 5 rows. At millions of customers this makes dimension tables rival fact table sizes. Mitigate with SCD Type 4 (separate current + history tables).",
  },
  {
    id: "dm-m2",
    domain: "data-modeling",
    difficulty: "medium",
    question: "What are Hubs, Links, and Satellites in Data Vault 2.0? Give an example Hub for an App Store model.",
    answer:
      "Hubs: unique business keys, no descriptive attributes. Links: relationships between hubs. Satellites: descriptive context with full history, each row timestamped. Example Hub: HUB_APP(app_hash_key, app_id, load_date, record_source). The App's name, category, and rating go in SAT_APP satellite. This separation means adding attributes never alters the hub — enabling parallel loading and auditability.",
  },
  {
    id: "dm-m3",
    domain: "data-modeling",
    difficulty: "medium",
    question: "What's the Medallion architecture? When is Bronze→Silver→Gold insufficient?",
    answer:
      "Bronze = raw as-is ingestion. Silver = cleaned, conformed, validated. Gold = business aggregates ready for consumption. Insufficient when: (1) you need sub-second serving — Gold is batch, add a real-time serving layer; (2) ML needs feature versioning and lineage — Gold doesn't track that, add a Feature Store; (3) GDPR cryptographic erasure — Bronze still holds raw PII, requires a separate PII vault pattern.",
  },
  {
    id: "dm-h1",
    domain: "data-modeling",
    difficulty: "hard",
    question: "Design the grain for an App Store downloads fact table where one download can span multiple devices per user. What are the tradeoffs?",
    answer:
      "Three candidate grains: (1) Download event per device — most granular, enables device analysis, but triple-counts 'user downloaded app X' if they download on 3 devices. (2) User-app — one row per user-app pair, no timeline or device breakdown. (3) User-app-device — best balance: no double-counting, device visibility preserved. Key rule: pick the grain that answers the primary business question. Use grain (1) for device analytics, grain (2) for revenue attribution. Never mix grains in one fact table.",
  },
  {
    id: "dm-h2",
    domain: "data-modeling",
    difficulty: "hard",
    question: "You have SCD Type 2 history rows for a user who submits a GDPR deletion request. How do you handle erasure?",
    answer:
      "Four options: (1) Hard delete all rows — breaks fact table foreign keys, corrupts historical aggregates. (2) Null out PII columns across all SCD2 rows, keep surrogate key — preserves fact table integrity, PII is gone. (3) Cryptographic erasure — encrypt PII per-user key at write time, delete key on request. Data is provably unreadable, original rows untouched. (4) Replace with tombstone dimension member — all history rows point to 'Deleted User.' Options 2 or 3 are correct; option 3 is most defensible to regulators. Document the approach in your data contract.",
  },
];

export function getQuestions(domain: Domain | "all", difficulty: Difficulty | "all"): Question[] {
  return questions.filter(
    (q) =>
      (domain === "all" || q.domain === domain) &&
      (difficulty === "all" || q.difficulty === difficulty)
  );
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
