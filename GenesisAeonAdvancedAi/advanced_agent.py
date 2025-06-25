import argparse
from datetime import datetime
from typing import Any, Dict, List, Optional
import yaml


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
    ) -> None:
        self.name = name
        self.state: Dict[str, Any] = state or {}
        self.symbol_memory: Dict[str, Any] = symbol_memory or {}
        self.history: List[Dict[str, Any]] = []
        self.log_path = log_path or f"{self.name}_log.yaml"
        self.state_path = state_path or f"{self.name}_state.yaml"
        self.symbol_memory_path = symbol_memory_path or f"{self.name}_symbols.yaml"

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
    parser.add_argument("--haiku", action="store_true", help="Gibt ein Haiku zum Ergebnis aus")
    args = parser.parse_args(argv)

    agent = AdvancedAeonAgent(
        "aeon_proto",
        {},
        log_path=args.log_file,
        state_path=args.state_file,
        symbol_memory_path=args.symbol_memory_file,
    )
    result = agent.act(args.input)
    dump_yaml(agent)
    agent.save_symbol_memory(args.symbol_memory_file)
    if args.haiku:
        print(generate_basic_haiku(result["symbol"]))
    print("Aktion ausgeführt:", result)


if __name__ == "__main__":
    main()
