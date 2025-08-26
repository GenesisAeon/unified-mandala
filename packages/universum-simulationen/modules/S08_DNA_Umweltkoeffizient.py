from __future__ import annotations

"""Estimate an environment adaptation coefficient for DNA sequences.

This module offers a light‑weight placeholder model mapping a DNA sequence
and an environmental factor to a single numeric coefficient.  It acts as a
scaffold for richer bio‑simulation modules mentioned in the project todo lists.
"""

from typing import Iterable, List

# simple base weights inspired by nucleotide bonding properties
BASE_WEIGHTS = {"A": 1.0, "T": 1.0, "C": 1.2, "G": 1.3}

def dna_environment_coefficient(sequence: str, factor: float) -> float:
    """Compute an adaptation coefficient for ``sequence``.

    The implementation averages base weights and scales them with the
    provided ``factor``.  The factor must be between ``0`` and ``1``.
    """
    if not 0.0 <= factor <= 1.0:
        raise ValueError("factor must be between 0 and 1")
    if not sequence:
        return 0.0
    total = 0.0
    for base in sequence.upper():
        total += BASE_WEIGHTS.get(base, 0.0)
    return (total / len(sequence)) * factor

def batch_coefficients(sequences: Iterable[str], factor: float) -> List[float]:
    """Vectorized variant of :func:`dna_environment_coefficient`."""
    return [dna_environment_coefficient(seq, factor) for seq in sequences]

__all__ = ["dna_environment_coefficient", "batch_coefficients"]
