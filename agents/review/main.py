"""Review agent module.

This agent evaluates text drafts and recommends whether they should be
approved for publishing.  The logic is intentionally simple: drafts that
contain common placeholder keywords such as ``TODO`` or ``FIXME`` are
rejected.  All other drafts are approved.  The result includes the reasons
for a rejection so that callers can provide feedback to authors.
"""

from dataclasses import dataclass
from typing import List, Iterable


@dataclass
class ReviewResult:
    """Outcome returned by :class:`ReviewAgent`.

    Attributes
    ----------
    approved:
        Indicates if the draft passed review.
    reasons:
        List of keywords that triggered a rejection.
    """

    approved: bool
    reasons: List[str]


class ReviewAgent:
    """Light‑weight draft reviewer.

    Parameters
    ----------
    disallowed_keywords:
        Iterable of keywords that, if present in a draft, cause the review to
        reject it.  Keywords are compared case‑insensitively.
    """

    def __init__(self, disallowed_keywords: Iterable[str] | None = None) -> None:
        if disallowed_keywords is None:
            disallowed_keywords = ["todo", "fixme", "wip"]
        self.disallowed = {kw.lower() for kw in disallowed_keywords}

    def evaluate(self, text: str) -> ReviewResult:
        """Evaluate ``text`` and return a :class:`ReviewResult`.

        Empty drafts are rejected.  Otherwise the draft is rejected only if it
        contains one of the disallowed keywords.
        """

        if not text or not text.strip():
            return ReviewResult(False, ["empty draft"])

        lowered = text.lower()
        reasons = [kw for kw in self.disallowed if kw in lowered]
        approved = not reasons
        return ReviewResult(approved, reasons)


__all__ = ["ReviewAgent", "ReviewResult"]

