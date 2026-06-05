#!/usr/bin/env python3
"""
session_manager.py — Deterministic state management for PrepForge.

Usage:
  python3 scripts/session_manager.py log <mode> <company> <score> <weak_areas>
  python3 scripts/session_manager.py summary
  python3 scripts/session_manager.py gaps
  python3 scripts/session_manager.py setup
"""

import os
import sys
import json
from datetime import datetime, timedelta
from pathlib import Path
from collections import Counter

SCRIPT_DIR = Path(__file__).parent
ROOT_DIR = SCRIPT_DIR.parent
DATA_DIR = ROOT_DIR / "data"
TEMPLATES_DIR = ROOT_DIR / "templates"
TRACKER_PATH = DATA_DIR / "tracker.md"
PROFILE_PATH = DATA_DIR / "profile.yml"
STORY_BANK_PATH = DATA_DIR / "story-bank.md"
HISTORY_DIR = DATA_DIR / "history"


def ensure_data_dir():
    DATA_DIR.mkdir(exist_ok=True)
    HISTORY_DIR.mkdir(exist_ok=True)


def setup():
    """Initialize data files from templates if they don't exist."""
    ensure_data_dir()

    if not TRACKER_PATH.exists():
        template = TEMPLATES_DIR / "tracker-template.md"
        if template.exists():
            TRACKER_PATH.write_text(template.read_text())
            print(f"Created {TRACKER_PATH}")
        else:
            TRACKER_PATH.write_text(
                "# PrepForge Session Tracker\n\n"
                "| Date | Mode | Company | Domain | Score | Weak Areas | Notes |\n"
                "|------|------|---------|--------|-------|------------|-------|\n"
            )

    if not STORY_BANK_PATH.exists():
        template = TEMPLATES_DIR / "story-bank-template.md"
        if template.exists():
            STORY_BANK_PATH.write_text(template.read_text())
            print(f"Created {STORY_BANK_PATH}")

    if not PROFILE_PATH.exists():
        print(f"Profile not found at {PROFILE_PATH}")
        print(f"Copy templates/profile.example.yml to data/profile.yml and fill it in.")
        print(f"Or run /prep in Claude Code for guided onboarding.")


def log_session(mode, company, score, weak_areas, notes="", domain=""):
    """Append a session record to tracker.md."""
    ensure_data_dir()

    if not TRACKER_PATH.exists():
        setup()

    date_str = datetime.now().strftime("%Y-%m-%d")
    score_display = f"{score}/5"

    row = f"| {date_str} | {mode} | {company} | {domain} | {score_display} | {weak_areas} | {notes} |\n"

    with open(TRACKER_PATH, "a") as f:
        f.write(row)

    print(f"Logged: {mode} @ {company} — {score_display}")
    print(f"Weak areas: {weak_areas}")
    print(f"Tracker: {TRACKER_PATH}")


def parse_tracker():
    """Parse tracker.md into a list of session dicts."""
    if not TRACKER_PATH.exists():
        return []

    sessions = []
    lines = TRACKER_PATH.read_text().splitlines()

    for line in lines:
        if not line.startswith("| ") or "Date" in line or "---" in line:
            continue
        parts = [p.strip() for p in line.split("|")[1:-1]]
        if len(parts) < 6:
            continue
        try:
            sessions.append({
                "date": parts[0],
                "mode": parts[1],
                "company": parts[2],
                "domain": parts[3],
                "score": float(parts[4].replace("/5", "")) if parts[4] else 0,
                "weak_areas": parts[5],
                "notes": parts[6] if len(parts) > 6 else "",
            })
        except (ValueError, IndexError):
            continue

    return sessions


def summary():
    """Print a summary of recent session performance."""
    sessions = parse_tracker()

    if not sessions:
        print("No sessions logged yet. Run /prep mock to start.")
        return

    cutoff = datetime.now() - timedelta(days=30)
    recent = [
        s for s in sessions
        if datetime.strptime(s["date"], "%Y-%m-%d") > cutoff
    ]

    if not recent:
        recent = sessions[-10:]

    by_mode = {}
    for s in recent:
        by_mode.setdefault(s["mode"], []).append(s["score"])

    print(f"\nPrepForge Summary — last {len(recent)} sessions")
    print("=" * 40)

    for mode, scores in sorted(by_mode.items()):
        avg = sum(scores) / len(scores)
        trend = ""
        if len(scores) >= 3:
            first_half = sum(scores[:len(scores)//2]) / (len(scores)//2)
            second_half = sum(scores[len(scores)//2:]) / (len(scores) - len(scores)//2)
            trend = " (improving)" if second_half > first_half + 0.2 else \
                    " (declining)" if second_half < first_half - 0.2 else " (stable)"
        print(f"  {mode:<18} avg {avg:.1f}/5{trend}")

    gaps()


def gaps():
    """Identify the most frequently flagged weak areas."""
    sessions = parse_tracker()
    if not sessions:
        return

    all_weak = []
    for s in sessions[-15:]:
        if s["weak_areas"]:
            areas = [a.strip() for a in s["weak_areas"].split(",")]
            all_weak.extend(areas)

    if not all_weak:
        print("\nNo weak areas recorded yet.")
        return

    counts = Counter(all_weak).most_common(5)
    print(f"\nMost frequent weak areas (last 15 sessions):")
    for area, count in counts:
        bar = "■" * count
        print(f"  {area:<35} {bar} ({count}x)")

    print(f"\nCritical gap: {counts[0][0]}")
    print(f"→ /prep drill {counts[0][0].lower().replace(' ', '-')}")


if __name__ == "__main__":
    args = sys.argv[1:]

    if not args or args[0] == "setup":
        setup()
    elif args[0] == "log" and len(args) >= 5:
        log_session(
            mode=args[1],
            company=args[2],
            score=args[3],
            weak_areas=args[4],
            notes=args[5] if len(args) > 5 else "",
            domain=args[6] if len(args) > 6 else "",
        )
    elif args[0] == "summary":
        summary()
    elif args[0] == "gaps":
        gaps()
    else:
        print(__doc__)
        sys.exit(1)
