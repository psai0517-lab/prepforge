# Domain Profile: Amazon — Data Engineer (L5 / L6)

## Interview Loop Structure
- **Recruiter screen** (30 min): LP intro, background
- **Phone screen** (60 min): 1 coding + 2 LP behavioral questions
- **Onsite / Virtual onsite** (5 rounds, each 60 min):
  - 2x Coding (LeetCode medium–hard, Python preferred)
  - 1x System Design (data pipeline or warehouse architecture)
  - 1x Behavioral (LP-heavy — often the "Bar Raiser" round)
  - 1x Domain / Architecture (EMR, Glue, Redshift, Kinesis ecosystem)

## Core Technologies
- **AWS native stack**: EMR (Spark on AWS), Glue (serverless ETL), Kinesis (streaming), Redshift (DW), Athena (query), S3 (storage), DynamoDB (NoSQL)
- **Apache Spark** on EMR — operational knowledge (cluster sizing, spot instances, cost optimization)
- **Apache Kafka / Kinesis** — streaming data ingestion patterns
- **SQL** — Redshift-specific optimization (distribution keys, sort keys, vacuum/analyze)
- **Python** — strong preference; boto3 fluency expected
- **Data modeling** — star schema, Redshift-optimized design

## Amazon-Specific Nuances
- **Leadership Principles are not soft skills** — they are evaluated with the same rigor as technical skills. Every round will assess at least 2–3 LPs explicitly.
- **Customer obsession is literal** — frame every technical decision in terms of the customer or business impact. "This reduces p99 latency by 200ms which means fewer cart abandonments" beats "this is more efficient."
- **Bar Raiser** — one interviewer is a Bar Raiser (from a different org) whose sole job is to enforce the hiring bar. They will probe your stories harder than anyone else.
- **Dive Deep** — Amazon expects engineers to know their systems to failure mode detail. "I'd look into it" is not an answer — you should already have looked into it.
- **Ownership** — no "it's not my job." If you saw a problem outside your scope and didn't flag it, that's a failure story.

## Leadership Principles Most Tested for Data Roles
1. **Ownership** — did you take full accountability, even when it was hard?
2. **Dive Deep** — do you know your systems at the lowest level?
3. **Deliver Results** — what did you actually ship, and how did you measure it?
4. **Bias for Action** — did you act under uncertainty or wait for perfect information?
5. **Invent and Simplify** — did you find a simpler solution to a hard problem?
6. **Have Backbone / Disagree and Commit** — did you push back when you disagreed?

## Common Interview Questions
- "Design Amazon's product catalog data pipeline — ingest from sellers, normalize, serve to search."
- "Your EMR job is running 3x longer than expected. Walk me through your debugging process."
- "How do you choose between Kinesis and Kafka for a new streaming use case at Amazon?"
- "Design a data warehouse schema for Amazon's order fulfillment analytics."
- "What's the difference between Redshift distribution styles? When would you use KEY vs ALL vs EVEN?"
- "How would you design a pipeline that needs to join a 10TB fact table with a 50GB dimension table efficiently in Spark?"

## Behavioral Question Examples
- "Tell me about a time you took ownership of a problem that wasn't in your job description." (Ownership)
- "Describe a time you had to make a decision with incomplete data." (Bias for Action)
- "Tell me about a time you disagreed with your manager and what happened." (Have Backbone)
- "Walk me through the most complex technical system you've built. Go deep." (Dive Deep)
- "Tell me about a time a project failed. What did you do?" (Deliver Results + Ownership)

## Interviewer Persona
Structured and thorough. Will ask for STAR format explicitly if you deviate. Will interrupt to ask "what was YOUR specific role?" if you use "we." Bar Raiser will challenge your results: "How do you know that was because of your change?" Expect follow-up on every behavioral story.

## Red Flags
- Using "we" in behavioral stories
- Vague results ("things improved significantly")
- Not connecting technical decisions to business/customer impact
- Stories without a challenge — "it went smoothly" is not a good story
- Waiting to be asked about edge cases and failure modes

## Recommended Prep Resources
- "Amazon Leadership Principles" — official page, memorize + internalize
- "Working Backwards" (Colin Bryar & Bill Carr) — Amazon culture from the inside
- Amazon Builder's Library — actual engineering practices published by Amazon
- LeetCode: focus on medium/hard array, tree, and graph problems in Python
