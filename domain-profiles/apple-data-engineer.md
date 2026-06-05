# Domain Profile: Apple — Data Engineer

## Interview Loop Structure
- **Recruiter screen** (30 min): background, motivation, comp alignment
- **Technical phone screen** (60 min): 1–2 Spark/SQL problems + system design sketch
- **Onsite / Virtual onsite** (5–6 rounds):
  - 2x Coding (Python/Scala, medium–hard)
  - 1x System Design (data pipeline or platform architecture)
  - 1x Domain Deep-Dive (Spark internals, streaming, data modeling)
  - 1x Behavioral (values, collaboration, ownership)
  - 1x Cross-functional (how you work with other teams)

## Core Technologies (expect depth, not breadth)
- **Apache Spark** — internals level: DAG, Catalyst, Tungsten, memory management, adaptive query execution
- **SQL at scale** — Presto/Trino, query optimization, partition pruning, window functions
- **Apache Kafka** — consumer groups, exactly-once, compaction, partition strategy
- **Data modeling** — Kimball dimensional, slowly changing dimensions, schema evolution
- **Privacy-aware pipeline design** — differential privacy concepts, on-device vs cloud data, data minimization
- **AWS or on-prem Hadoop** — Apple runs significant on-prem infra alongside cloud

## Apple-Specific Nuances
- **Privacy is a first-class engineering concern** — not compliance theater. Expect questions like "how would you design this pipeline so you never need to see the raw data?"
- **Hardware-software co-design** — pipelines that process Apple Watch / iPhone sensor data need awareness of edge compute constraints
- **On-device ML pipelines** — CoreML, on-device inference vs cloud aggregation tradeoffs
- **Long-term thinking** — Apple moves slowly and deliberately. "We'd ship it faster if we cut X" is not a winning answer.
- **Craftsmanship** — sloppy code or hand-waving gets called out immediately

## Common Interview Questions
- "Design a real-time pipeline to aggregate health metrics from 500M Apple Watch devices with differential privacy guarantees."
- "You have a Spark job that's failing with OutOfMemoryError on the executor. Walk me through how you'd debug it."
- "What happens during a Spark shuffle? How would you optimize a job with significant shuffle overhead?"
- "How would you design a schema evolution strategy for a pipeline serving 50 downstream teams?"
- "Explain Spark's Catalyst optimizer. At what stage does predicate pushdown happen?"
- "Design a data deletion system that propagates user deletion requests across 200 heterogeneous data stores within 30 days."
- "How does ALS handle sparse user-item matrices at scale? What are the BLAS/LAPACK implications?"

## Interviewer Persona
Terse. Direct. Will not ask "how are you?" and mean it. Short questions followed by deep follow-ups. If you hand-wave ("I'd use a distributed system"), expect: "Which one? Why? What breaks at 10x?" Silence is fine — they're thinking alongside you.

## Red Flags (instant signal drop)
- Using "we" when describing individual work
- Generic answers to privacy questions ("we'd encrypt the data")
- Not knowing the difference between `cache()` and `persist()`
- Proposing a solution without acknowledging the privacy implications
- Saying "I'd look it up" for a foundational concept

## Recommended Prep Resources
- Spark: The Definitive Guide (Chambers & Zaharia) — chapters on internals
- "Spark Performance Tuning" — Databricks blog series
- Apple's differential privacy blog posts (published externally)
- High Performance Spark (Karau & Warren)
