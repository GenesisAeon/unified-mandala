import yaml
from datetime import datetime


def evaluate_crep(data):
    """Return example CREP values."""
    return {
        'coherence': 0.85,
        'resonance': 0.75,
        'emergence': 0.65,
        'presence': 1,
    }


def log_crep_cycle(agent_name: str, scores: dict):
    """Append a CREP log entry."""
    entry = {
        'timestamp': datetime.now().isoformat(),
        'crep': scores,
    }
    with open(f"{agent_name}_crep_log.yaml", 'a') as f:
        yaml.dump([entry], f)

