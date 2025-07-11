import argparse
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional
import yaml

from .memory_store import store_result
from .aeon_processor import (
    fraktal_feedback_metrics,
    advanced_crep_eval,
    translate_numeric_to_symbolic,
)


def generate_basic_haiku(symbol: str) -> str:
    """Return a deterministic haiku for the given symbol."""
    if symbol == "\u0394":
        return (
            "change weaves its path\n"
            "memory traces interlace\n"
            "delta guides the flow"
        )
    return (
        "nested loops unfold\n"
        "reflections echo the core\n"
        "nabla draws us in"
    )


class AdvancedAeonAgent:
    """Agent with YAML persistence and simple symbol reflection."""

    def __init__(
        self,
        name: str,
        state: Optional[Dict[str, Any]] = None,
        symbol_memory: Optional[Dict[str, Any]] = None,
        log_path: Optional[str] = None,
        state_path: Optional[str] = None,
        symbol_memory_path: Optional[str] = None,
        memory_path: Optional[str] = None,
    ) -> None:
        self.name = name
        self.state: Dict[str, Any] = state or {}
        self.symbol_memory: Dict[str, Any] = symbol_memory or {}
        self.history: List[Dict[str, Any]] = []
        self.log_path = log_path or f"{self.name}_log.yaml"
        self.state_path = state_path or f"{self.name}_state.yaml"
        self.symbol_memory_path = symbol_memory_path or f"{self.name}_symbols.yaml"
        self.memory_path = memory_path

    def act(self, input_data: Any) -> Dict[str, Any]:
        decision = self.process_input(input_data)
        self.state = self.update_state(decision)
        self.persist(input_data, decision)
        return decision

    def process_input(self, data: Any) -> Dict[str, Any]:
        symbol = self.assign_symbol(data)
        reflection = self.crep_reflection(symbol)
        self.symbol_memory[symbol] = self.symbol_memory.get(symbol, 0) + 1
        return {"symbol": symbol, "reflection": reflection}

    def assign_symbol(self, data: Any) -> str:
        return "\u0394" if isinstance(data, dict) else "\u2207"

    def crep_reflection(self, symbol: str) -> Dict[str, float]:
        return {"coherence": 0.85, "presence": 1.0, "emergence": 0.65}

    def update_state(self, decision: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "last_symbol": decision["symbol"],
            "last_reflection": decision["reflection"],
        }

    def persist(self, input_data: Any, decision: Dict[str, Any]) -> None:
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "input": input_data,
            "decision": decision,
        }
        self.history.append(log_entry)
        with open(self.log_path, "a", encoding="utf-8") as f:
            yaml.safe_dump([log_entry], f, allow_unicode=True)
        if self.memory_path:
            store_result(log_entry, Path(self.memory_path))

    def act_with_metrics(self, data: Any) -> Dict[str, Any]:
        """Process input and also return CREP metrics via fraktal feedback."""
        symbolic, score, metrics = fraktal_feedback_metrics([float(data)])
        decision = {
            "symbolic": symbolic,
            "crep_score": score,
            "metrics": metrics,
        }
        self.persist(data, decision)
        return decision

    def act_with_advanced_metrics(self, values: List[float]) -> Dict[str, Any]:
        """Process numeric list with advanced_crep_eval and emit haiku."""
        symbolic_data = translate_numeric_to_symbolic(values)
        metrics = advanced_crep_eval(symbolic_data)
        haiku = generate_basic_haiku(symbolic_data.get("symbol", "\u0394"))
        decision = {
            "symbolic": symbolic_data,
            "metrics": metrics,
            "haiku": haiku,
        }
        self.persist(values, decision)
        return decision

    def act_with_fraktal_haiku(self, values: List[float]) -> Dict[str, Any]:
        """Run fraktal feedback metrics and store haiku in the decision."""
        symbolic, score, metrics = fraktal_feedback_metrics(values)
        haiku = generate_basic_haiku(symbolic.get("symbol", "\u0394"))
        decision = {
            "symbolic": symbolic,
            "crep_score": score,
            "metrics": metrics,
            "haiku": haiku,
        }
        self.persist(values, decision)
        return decision

    def save_symbol_memory(self, path: Optional[str] = None) -> None:
        """Persist symbol memory to a YAML file."""
        file_path = path or self.symbol_memory_path
        if not file_path:
            return
        with open(file_path, "w", encoding="utf-8") as f:
            yaml.safe_dump(self.symbol_memory, f, allow_unicode=True)


def dump_yaml(agent: AdvancedAeonAgent) -> None:
    with open(agent.state_path, "w", encoding="utf-8") as f:
        yaml.safe_dump(agent.state, f, allow_unicode=True)


def main(argv: Optional[List[str]] = None) -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", help="Eingabewert für den Agenten")
    parser.add_argument("--log-file", help="Pfad für YAML-Logdatei")
    parser.add_argument("--state-file", help="Pfad für YAML-State-Datei")
    parser.add_argument(
        "--symbol-memory-file",
        help="Pfad für YAML-Datei zum Speichern des Symbolspeichers",
    )
    parser.add_argument(
        "--memory-file",
        help="Pfad für JSON-Datei zum Persistieren aller Aktionen",
    )
    parser.add_argument("--haiku", action="store_true", help="Gibt ein Haiku zum Ergebnis aus")
    parser.add_argument(
        "--advanced-values",
        help="Komma-separierte Zahlen für advanced CREP Analyse",
    )
    parser.add_argument(
        "--fraktal-values",
        help="Komma-separierte Zahlen für fraktal Feedback Analyse",
    )
    args = parser.parse_args(argv)

    agent = AdvancedAeonAgent(
        "aeon_proto",
        {},
        log_path=args.log_file,
        state_path=args.state_file,
        symbol_memory_path=args.symbol_memory_file,
        memory_path=args.memory_file,
    )
    if args.fraktal_values:
        values = [float(v.strip()) for v in args.fraktal_values.split(",") if v.strip()]
        result = agent.act_with_fraktal_haiku(values)
    elif args.advanced_values:
        values = [float(v.strip()) for v in args.advanced_values.split(",") if v.strip()]
        result = agent.act_with_advanced_metrics(values)
    else:
        result = agent.act(args.input)
    dump_yaml(agent)
    agent.save_symbol_memory(args.symbol_memory_file)
    if args.haiku:
        print(generate_basic_haiku(result["symbol"]))
    print("Aktion ausgeführt:", result)


if __name__ == "__main__":
    main()
