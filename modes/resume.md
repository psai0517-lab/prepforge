# Mode: resume — View and Update Your Resume

Store and maintain your resume inside PrepForge so every mode can reference your actual experience.

## Commands

### `/prep resume` — view current resume
Display the contents of `data/resume.md`. If it doesn't exist, enter update mode.

### `/prep resume update` — update resume
Three ways to provide your resume:

1. **Paste text** — paste your CV/resume directly into the chat
2. **File path** — provide a path to a local file: `/prep resume update ~/Documents/resume.pdf` or `.md` or `.txt`
3. **Describe experience** — tell Claude about your experience and it will draft the resume for you

### Handling input types

**Pasted text / markdown:**
Clean up formatting, normalize to the standard structure below, save to `data/resume.md`.

**File path provided:**
```bash
# For .md or .txt files — read directly
cat "{path}"

# For .pdf files — extract text
python3 -c "
import subprocess
result = subprocess.run(['pdftotext', '{path}', '-'], capture_output=True, text=True)
print(result.stdout if result.returncode == 0 else 'pdftotext not available — please paste text directly')
"
```
If extraction fails, ask the user to paste the text directly.

**Described verbally:**
Ask structured questions and draft a resume from the answers:
- Current title and company
- Previous roles (company, title, dates, key achievements)
- Top 3–5 technical skills with depth level
- Education
- Certifications or notable projects

## Output structure — `data/resume.md`

Normalize all input to this format for consistent parsing by other modes:

```markdown
# Resume — {Name}
Last updated: {YYYY-MM-DD}

## Summary
{2–3 sentence professional summary}

## Experience

### {Title} — {Company} ({Start} – {End})
_{Industry context / company descriptor}_
- {Achievement bullet with metric}
- {Achievement bullet with metric}
...

## Skills
**{Category}:** {skill}, {skill}, {skill}
...

## Education
{Degree} — {School} ({Year})

## Certifications
- {Name} — {Issuer} ({Year})
```

## Post-update confirmation

After saving:
```
Resume saved to data/resume.md
Last updated: {date}

Detected:
  Current role:   {title} @ {company}
  Experience:     {N} years
  Top skills:     {skill1}, {skill2}, {skill3}
  Companies:      {list}

Your resume is now used by:
  /prep plan      → gap analysis vs JD requirements
  /prep mock      → interviewer references your background
  /prep behavioral → story suggestions from your actual experience
  /prep debrief   → gap analysis anchored to your real skills

→ Run /prep plan {company} {role} {level} to see how your resume maps to the target role.
```

## Updating specific sections

The user can say things like:
- "Add a new role at Affirm" → append to Experience section
- "Update my skills" → replace Skills section
- "Change my summary" → replace Summary section

Make the targeted edit to `data/resume.md` directly without regenerating the whole file.
