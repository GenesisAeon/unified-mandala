"""ZahlensystemKonverter module.

This module provides conversion between common numeral systems including
binary, decimal, hexadecimal and a golden ratio based system (phinary).
"""
from __future__ import annotations

from typing import Dict

BASES: Dict[str, int] = {
    "binary": 2,
    "decimal": 10,
    "hex": 16,
}


def decimal_to_phi(n: int) -> str:
    """Convert a decimal integer to its phinary (base-phi) representation.

    The algorithm uses a Zeckendorf-style decomposition with Fibonacci numbers.
    """
    if n == 0:
        return "0"
    fib = [1, 2]
    while fib[-1] <= n:
        fib.append(fib[-1] + fib[-2])
    result = []
    i = len(fib) - 2
    skip = False
    while i >= 0:
        f = fib[i]
        if f <= n and not skip:
            result.append("1")
            n -= f
            skip = True
        else:
            result.append("0")
            skip = False
        i -= 1
    return "".join(result).lstrip("0") or "0"


def phi_to_decimal(s: str) -> int:
    """Convert a phinary string back to a decimal integer."""
    if s == "0":
        return 0
    fib = [1, 2]
    while len(fib) < len(s):
        fib.append(fib[-1] + fib[-2])
    total = 0
    for ch, f in zip(reversed(s), fib):
        if ch == "1":
            total += f
    return total


def convert(number: str, from_system: str, to_system: str) -> str:
    """Convert `number` from `from_system` to `to_system`.

    Supported systems: ``binary``, ``decimal``, ``hex``, and ``phi``.
    """
    if from_system == "phi":
        dec = phi_to_decimal(number)
    elif from_system in BASES:
        dec = int(number, BASES[from_system])
    else:
        raise ValueError(f"Unsupported source system: {from_system}")

    if to_system == "phi":
        return decimal_to_phi(dec)
    elif to_system in BASES:
        if to_system == "hex":
            return format(dec, "x")
        if to_system == "binary":
            return format(dec, "b")
        return str(dec)
    else:
        raise ValueError(f"Unsupported target system: {to_system}")

