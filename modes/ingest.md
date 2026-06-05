# Mode: ingest — Add Real Interview Experiences

Ingest raw interview experiences (from 1point3acres, Blind, or personal notes) into the local question database.

## Why this matters
Generic prep tools lack company-specific, recent signal. This mode turns raw paste-ins into structured, queryable data that future mock sessions can draw from.

## Execution

### Step 1 — Prompt for input
```
Paste the interview experience below. Include:
  - Company and role
  - Interview stage (OA / Phone Screen / Onsite / Virtual Onsite)
  - Date (approximate is fine)
  - Questions asked (as much detail as you remember)
  - Any observations about the interviewer's style or focus

Press Enter twice when done.
```

### Step 2 — Parse the input
Extract:
- `company` — normalize to lowercase slug (e.g., "apple")
- `role` — normalize (e.g., "data-engineer")
- `level` — infer from context if not stated
- `stage` — phone-screen / onsite / oa
- `date` — YYYY-MM (approximate)
- `questions[]` — array of question objects with `text`, `domain`, `type`
- `notes` — interviewer style, focus areas, red flags

### Step 3 — Classify each question
For each question:
- `type`: coding | system-design | behavioral | domain-knowledge | sql | debugging
- `domain`: spark | kafka | distributed-systems | sql | python | data-modeling | etc.
- `difficulty`: easy | medium | hard (relative to role level)

### Step 4 — Append to local database
Write to `data/questions/{company}.json`:
```json
{
  "company": "apple",
  "role": "data-engineer",
  "level": "staff",
  "stage": "onsite",
  "date": "2026-03",
  "source": "user-contributed",
  "questions": [
    {
      "text": "Design a system to process and store sensor data from 100M Apple Watch devices in real time.",
      "type": "system-design",
      "domain": "distributed-systems",
      "difficulty": "hard"
    }
  ],
  "notes": "Interviewer was terse. Asked 'why not X?' three times. Deep on Spark memory model."
}
```

If `data/questions/{company}.json` already exists, append to the `experiences` array rather than overwriting.

### Step 5 — Confirm
```
Ingested {N} questions for {company} {role} ({stage})
Added to: data/questions/{company}.json

These questions will appear in future /prep mock {domain} {company} sessions.
→ Run /prep mock now to use the new data
```
