from __future__ import annotations

"""Particle force kernel for universum-simulationen package.

This module provides a small utility to compute basic forces between two
particles.  It currently supports gravitational and electrostatic (Coulomb)
forces.  The goal of this module is to serve as a minimal physics kernel
that other simulations can import.
"""

from dataclasses import dataclass
from typing import Dict

# Gravitational constant (m^3 kg^-1 s^-2)
G = 6.674e-11
# Coulomb constant (N m^2 C^-2)
K = 8.988e9


@dataclass
class Particle:
    """Simple particle representation with mass and electric charge."""

    mass: float  # in kilograms
    charge: float  # in Coulombs


def compute_force(p1: Particle, p2: Particle, distance: float) -> Dict[str, float]:
    """Compute forces between two particles.

    Args:
        p1: First particle.
        p2: Second particle.
        distance: Distance between particles in meters. Must be > 0.

    Returns:
        A dictionary with ``gravity`` and ``electric`` force magnitudes in
        Newtons.  The electric value preserves the sign (attraction vs.
        repulsion).
    """

    if distance <= 0:
        raise ValueError("distance must be positive")

    gravity = G * p1.mass * p2.mass / (distance ** 2)
    electric = K * p1.charge * p2.charge / (distance ** 2)
    return {"gravity": gravity, "electric": electric}
