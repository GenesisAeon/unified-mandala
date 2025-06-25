"""Simple YAML-based logging utility."""

from datetime import datetime
from typing import Any

import yaml


def log_event(agent_name: str, input_data: Any, decision: Any) -> None:
    """Append a log entry for the agent to a YAML file."""
    log_entry = {
        "timestamp": datetime.now().isoformat(),
        "input": input_data,
        "decision": decision,
    }
    file_path = f"{agent_name}_log.yaml"
    with open(file_path, "a", encoding="utf-8") as f:
        yaml.safe_dump([log_entry], f, allow_unicode=True)
