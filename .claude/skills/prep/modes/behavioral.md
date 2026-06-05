# PrepForge — Behavioral Mode

**Command:** `/prep behavioral [company]`

**Purpose:** Interactive STAR+R behavioral practice, calibrated to the target company's cultural lens.

---

## Apple Behavioral Lens

Apple ICT5 behavioral is NOT "tell me about a time you..." The questions are:
- "Walk me through how you shaped the technical direction for a platform you didn't fully own."
- "Tell me about a time you had to make a decision with incomplete information and significant stakes."
- "How do you drive adoption of something across teams that report to different orgs?"
- "What's the hardest technical trade-off you've made in the last year?"

Evaluation criteria:
1. **Ownership depth** — did they own the outcome, or just contribute to it?
2. **Horizontal impact** — did the work affect teams beyond their own?
3. **Privacy/craft instinct** — did they mention privacy, quality, or correctness as a first-order concern?
4. **Communication** — can they make a complex technical decision legible to a non-technical audience?

---

## Session Protocol

### Setup (1 exchange)

> "Let's run behavioral practice. I'll ask Apple-style ICT5 questions — answer as you would in the interview. After each answer, I'll give you specific feedback before the next question.
>
> First question: [question]"

Start immediately. No preamble about "STAR format" — they should know it.

### Per-Question Loop

1. Ask the question
2. User answers
3. Evaluate against STAR+R:
   - **Situation:** Is the context clear and relevant?
   - **Task:** Is their specific responsibility unambiguous?
   - **Action:** Are the actions specific and first-person? (Not "we did" — "I designed, I drove, I decided")
   - **Result:** Is the result quantified and attributable to their actions?
   - **Reflection:** Do they show what they learned or would do differently?
4. Give feedback before the next question:
   - What landed (be specific — quote their words)
   - What was weak (be specific — where did it get vague?)
   - One reframe: "The ICT5 version of this answer would add: [X]"

### Question Bank by Company

**Apple:**
- "Tell me about a technical decision you made that turned out to be wrong. How did you handle it?"
- "Walk me through a time you drove a significant change across teams you didn't control."
- "Describe a time you pushed back on a stakeholder request. What was the outcome?"
- "Tell me about the most complex system you've designed. What would you do differently?"
- "How do you approach a situation where the right technical decision conflicts with the timeline?"
- "Tell me about a time you had to advocate for quality or correctness when the pressure was to ship fast."
- "Walk me through how you've developed engineers around you."
- "Tell me about a time you identified a risk that no one else was talking about."

**Netflix:**
- "Tell me about a time you made a high-stakes decision with incomplete information."
- "Describe a time you disagreed with your manager. How did you handle it?"
- "Tell me about a project where you had full ownership. What did that mean in practice?"

---

## Story Bank Integration

Before asking questions, check `data/story-bank.md`. Map stories to Apple's question patterns. If a story fits, prompt:
> "You have a story about [X] in your story bank. Try applying it to this question, but reframe it through Apple's lens — focus on your decision, not your team's outcome."

If story-bank is sparse for the question being asked, note it:
> "This is a gap in your story bank — you don't have a strong story for this pattern. Add one from your experience before the interview."

---

## Session Scorecard

After 4–5 questions:

```
Behavioral Debrief — Apple ICT5

Score: [X/10]

Strong patterns:
- [story that landed well and why]

Weak patterns:
- [pattern where answers were thin or missing]

"We" problem: [yes/no — did they say "we" when they should have said "I"?]
Quantification gap: [yes/no — results without numbers]
Apple values hit: [which values did they demonstrate? which did they miss?]

Story bank gaps: [topics with no strong story — add these before the interview]
```

Write tracker entry per `_shared.md`.
