from __future__ import annotations

"""Two-dimensional field quantization utilities.

This module provides small helper functions used in simulation
prototypes.  A field is represented as a 2D list of floats.  The
``quantum_step`` function applies a simple random perturbation to each
cell to mimic dynamic quantum states.
"""

from typing import List, Optional
import random


def initialize_field(width: int, height: int, value: float = 0.0) -> List[List[float]]:
    """Create a field initialized with a constant value.

    Args:
        width: Number of columns.
        height: Number of rows.
        value: Initial value for each cell.

    Returns:
        Two-dimensional list representing the field.
    """

    return [[value for _ in range(width)] for _ in range(height)]


def quantum_step(
    field: List[List[float]],
    amplitude: float,
    seed: Optional[int] = None,
) -> List[List[float]]:
    """Apply a random perturbation to each cell of the field.

    Args:
        field: Two-dimensional list representing the current field.
        amplitude: Maximum absolute change applied per cell.
        seed: Optional random seed for reproducibility.

    Returns:
        New field with updated values.
    """

    rng = random.Random(seed)
    return [
        [cell + rng.uniform(-amplitude, amplitude) for cell in row]
        for row in field
    ]


__all__ = ["initialize_field", "quantum_step"]
