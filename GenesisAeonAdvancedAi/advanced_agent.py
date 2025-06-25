import argparse
from datetime import datetime
from typing import Any, Dict, List, Optional

import yaml


class AdvancedAeonAgent:
    """Agent with YAML persistence and simple symbol reflection."""

    def __init__(
        self,
        name: str,
        state: Optional[Dict[str, Any]] = None,
        symbol_memory: Optional[Dict[str, Any]] = None,
        log_path: Optional[str] = None,
        state_path: Optional[str] = None,
    ) -> None:
        self.name = name
        self.state: Dict[str, Any] = state or {}
        self.symbol_memory: Dict[str, Any] = symbol_memory or {}
        self.history: List[Dict[str, Any]] = []
        self.log_path = log_path or f"{self.name}_log.yaml"
        self.state_path = state_path or f"{self.name}_state.yaml"

    def act(self, input_data: Any) -> Dict[str, Any]:
        decision = self.process_input(input_data)
        self.state = self.update_state(decision)
        self.persist(input_data, decision)
        return decision

    def process_input(self, data: Any) -> Dict[str, Any]:
        symbol = self.assign_symbol(data)
        reflection = self.crep_reflection(symbol)
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


def dump_yaml(agent: AdvancedAeonAgent) -> None:
    with open(agent.state_path, "w", encoding="utf-8") as f:
        yaml.safe_dump(agent.state, f, allow_unicode=True)


def main(argv: Optional[List[str]] = None) -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", help="Eingabewert für den Agenten")
    parser.add_argument("--log-file", help="Pfad für YAML-Logdatei")
    parser.add_argument("--state-file", help="Pfad für YAML-State-Datei")
    args = parser.parse_args(argv)

    agent = AdvancedAeonAgent(
        "aeon_proto",
        {},
        log_path=args.log_file,
        state_path=args.state_file,
    )
    result = agent.act(args.input)
    dump_yaml(agent)
    print("Aktion ausgeführt:", result)


if __name__ == "__main__":
    main()
