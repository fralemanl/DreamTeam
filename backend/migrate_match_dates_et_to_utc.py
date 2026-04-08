"""
Migration script: interpret existing match_date values as America/New_York (ET)
and rewrite them as naive UTC datetimes in the database.

Safe by default:
- Dry-run mode is default (no DB writes).
- Use --apply to persist changes.

Usage:
  python migrate_match_dates_et_to_utc.py
    python migrate_match_dates_et_to_utc.py --apply --match-ids 3,10,12
  python migrate_match_dates_et_to_utc.py --limit 20
"""

from __future__ import annotations

import argparse
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

from database import SessionLocal
from models import Match


ET_ZONE = ZoneInfo("America/New_York")


def to_utc_naive_from_et_naive(dt: datetime) -> datetime:
    """Treat naive datetime as ET local time, convert to UTC naive."""
    et_aware = dt.replace(tzinfo=ET_ZONE)
    utc_aware = et_aware.astimezone(timezone.utc)
    return utc_aware.replace(tzinfo=None)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Convert stored match_date values from ET-naive to UTC-naive"
    )
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Persist converted datetimes to DB (default is dry-run)",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help="Process at most N matches",
    )
    parser.add_argument(
        "--match-ids",
        type=str,
        default="",
        help="Comma-separated match IDs to process, required with --apply",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    ids = []
    if args.match_ids.strip():
        ids = [int(x.strip()) for x in args.match_ids.split(",") if x.strip()]

    if args.apply and not ids:
        raise SystemExit("For safety, --apply requires --match-ids (e.g. --match-ids 3,10)")

    db = SessionLocal()
    try:
        query = db.query(Match).order_by(Match.id)
        if ids:
            query = query.filter(Match.id.in_(ids))
        if args.limit:
            matches = query.limit(args.limit).all()
        else:
            matches = query.all()

        if not matches:
            print("No matches found.")
            return

        changed = 0
        skipped = 0

        for m in matches:
            if m.match_date is None:
                skipped += 1
                continue

            original = m.match_date
            converted = to_utc_naive_from_et_naive(original)

            if converted == original:
                skipped += 1
                continue

            changed += 1
            print(
                f"Match {m.id}: {original.isoformat()} ET-naive -> {converted.isoformat()} UTC-naive"
            )

            if args.apply:
                m.match_date = converted

        if args.apply:
            db.commit()
            print(f"\nApplied changes: {changed} match(es). Skipped: {skipped}.")
        else:
            print(f"\nDry-run only. Would change: {changed} match(es). Skipped: {skipped}.")
            print("Run with --apply to persist changes.")

    except Exception as exc:
        db.rollback()
        print(f"Error during migration: {exc}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
