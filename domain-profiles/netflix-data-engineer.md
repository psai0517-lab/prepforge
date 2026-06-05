# Domain Profile: Netflix — Data Engineer (L5 / Data Engineer 5)

## Interview Loop Structure
- **Recruiter screen** (30 min): background, role alignment
- **Hiring manager screen** (45–60 min): technical background + culture fit
- **Technical screen** (60 min): SQL + data pipeline problem
- **Onsite** (4–5 rounds):
  - 1x Data Engineering coding (Spark/Python, hard)
  - 1x System Design (data platform or pipeline at petabyte scale)
  - 1x Domain / Architecture (correctness, deletion, lineage)
  - 1x Behavioral (culture fit — "stunning colleagues" bar)
  - 1x Cross-functional (working with Data Science, Product, Legal)

## Core Technologies
- **Apache Spark** — production-grade: exactly-once guarantees, correctness under failure, cost optimization
- **Apache Flink** — Netflix runs significant Flink infrastructure; streaming correctness is critical
- **Apache Kafka** — event sourcing, exactly-once delivery, consumer lag management
- **Iceberg / Hive** — Netflix is a primary contributor to Apache Iceberg; deep table format knowledge expected
- **Presto / Trino** — primary SQL engine; query optimization, cost-based optimizer
- **Druid / Pinot** — real-time OLAP for dashboards and experimentation
- **Python** — Pandas, PySpark, data manipulation at scale

## Netflix-Specific Nuances
- **Scale is literal** — 200M+ subscribers, petabytes of data, billions of daily events. "This would be slow at scale" is not sufficient — what specifically breaks and how do you fix it?
- **Privacy deletion at scale** — Netflix has a published architecture for GDPR/CCPA deletion across 1,300+ datasets. Understand the problem deeply: propagation latency, heterogeneous stores, correctness guarantees.
- **Experimentation platform** — A/B testing infrastructure is a core use case. Understand how experiment assignment, event logging, and metric computation connect.
- **Freedom and responsibility** — No PMs telling you what to build. You are expected to own the full surface area: design, implementation, operations, on-call. "I'd check with my manager" is a red flag.
- **Stunning colleagues bar** — Not just "smart." Netflix filters for people who raise the bar of the people around them.

## Common Interview Questions
- "Design a system to enforce data deletion across Netflix's data lake — GDPR requests must propagate within 30 days, CCPA within 45. Walk me through the architecture."
- "A Flink job consuming from Kafka is producing duplicate records in S3. How do you debug it and fix it?"
- "What are the tradeoffs between Iceberg, Delta Lake, and Hudi? When would you choose each?"
- "Design Netflix's experimentation data pipeline — from event collection to metric computation for A/B tests."
- "You have a Presto query that takes 8 minutes. How do you approach optimization?"
- "How do you implement exactly-once semantics in a Spark Structured Streaming job writing to S3?"
- "Design a system to compute real-time recommendations for 200M users with <100ms serving latency."

## Interviewer Persona
Open-ended and high-bar. Gives you minimal structure — expects you to build it. "Design a deletion system" with no further constraints. Will add constraints after you've proposed a design. Expects you to challenge your own assumptions. Silence is comfortable — they're evaluating whether you can navigate ambiguity without hand-holding.

## Behavioral — Culture Fit Questions
- "Tell me about a time you disagreed with a technical decision and what you did about it."
- "Describe a project where you had complete ownership. What would you do differently?"
- "When have you had to make a decision with incomplete information? What was the outcome?"
- "How do you know when something is good enough to ship?"

## Red Flags
- Saying "I'd align with the team" without stating your own position first
- Designing for average scale, not Netflix-level scale
- Not knowing what Apache Iceberg is
- Needing to be asked "what breaks at scale?" — should be raised proactively
- Generic STAR stories without quantified results

## Recommended Prep Resources
- Netflix Tech Blog: "Efficient Deletions in Netflix's Data Lake" (published)
- Netflix Tech Blog: "Migrating Netflix to Apache Iceberg using Apache Spark"
- "Streaming Systems" (Tyler Akidau et al.) — Flink/Beam concepts
- Apache Iceberg documentation — table format spec
- Netflix's QCon talks on data platform architecture
