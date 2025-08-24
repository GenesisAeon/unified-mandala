from __future__ import annotations
"""Simple dark matter field model utilities.

This module provides helper functions to approximate the
influence of a uniform dark matter density on a spherical region.
It is intentionally lightweight and intended for educational
simulation prototypes.
"""

import math

# Gravitational constant used for the toy model.
G: float = 6.67430e-11

def mass_enclosed(density: float, radius: float) -> float:
    """Return mass enclosed within ``radius`` for constant ``density``.

    Args:
        density: Mass density of dark matter in kg/m^3.
        radius: Radius of the sphere in meters.
    """
    return (4.0 / 3.0) * math.pi * density * radius ** 3

def gravitational_field(density: float, radius: float) -> float:
    """Compute gravitational field strength at ``radius``.

    This uses the mass enclosed by a uniform dark matter sphere and
    returns the Newtonian field strength at the surface.
    """
    mass = mass_enclosed(density, radius)
    return G * mass / (radius ** 2)

__all__ = ["G", "mass_enclosed", "gravitational_field"]
