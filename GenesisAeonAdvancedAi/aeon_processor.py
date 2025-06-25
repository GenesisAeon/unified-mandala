from typing import Iterable, Dict, Any


def sonify(values: Iterable[float]) -> list[float]:
    """Map numeric values to simple tone frequencies."""
    return [440.0 + v * 40.0 for v in values]


def visualize_light(values: Iterable[float]) -> list[str]:
    """Map numeric values to HSL color strings."""
    colors = []
    for v in values:
        hue = int((v % 1) * 360)
        colors.append(f"hsl({hue},70%,50%)")
    return colors


def assign_symbol(values: Iterable[float]) -> str:
    """Assign a symbolic marker based on the average value.

    Mapping inspired by project guidelines:
    - avg > 0.8 → sun symbol (☀️)
    - avg > 0.5 → growth symbol (🌱)
    - avg > 0.2 → fluid symbol (💧)
    - otherwise → void symbol (⚫)
    """
    vals = list(values)
    avg = sum(vals) / len(vals) if vals else 0
    if avg > 0.8:
        return "\u2600"  # ☀️
    elif avg > 0.5:
        return "\U0001F331"  # 🌱
    elif avg > 0.2:
        return "\U0001F4A7"  # 💧
    else:
        return "\u26AB"  # ⚫


def translate_numeric_to_symbolic(tensor: Iterable[float]) -> Dict[str, Any]:
    """Translate numeric input into symbolic representations."""
    vals = list(map(float, tensor))
    return {
        "klang": sonify(vals),
        "licht": visualize_light(vals),
        "symbol": assign_symbol(vals),
    }


def CREP_eval(symbolic_data: Dict[str, Any]) -> int:
    """Very rough CREP evaluation returning -1, 0 or 1."""
    freq_avg = sum(symbolic_data["klang"]) / len(symbolic_data["klang"])
    if freq_avg > 500:
        return 1
    if freq_avg < 440:
        return -1
    return 0


def refactor_fraktal(symbolic_data: Dict[str, Any]) -> Dict[str, Any]:
    """Simple refactoring: invert frequencies."""
    symbolic_data["klang"] = [440 - (f - 440) for f in symbolic_data["klang"]]
    return symbolic_data


def fraktal_feedback(data: Iterable[float], depth: int = 3):
    """Recursive fractal feedback loop with basic CREP evaluation."""
    symbolic = translate_numeric_to_symbolic(data)
    for _ in range(depth):
        score = CREP_eval(symbolic)
        if score == -1:
            symbolic = refactor_fraktal(symbolic)
        else:
            break
    return symbolic, score
