"""Utilities to import conversation fragments into memory."""

from __future__ import annotations

import os
import yaml
from typing import List, Dict

from .self_organizing_memory import SelfOrganizingMemory


def load_conversation_fragments(folder: str) -> List[Dict[str, any]]:
    """Load YAML conversation fragments from *folder* sorted by filename."""
    fragments: List[Dict[str, any]] = []
    for fname in sorted(os.listdir(folder)):
        if fname.endswith('.yaml'):
            path = os.path.join(folder, fname)
            with open(path, 'r', encoding='utf8') as f:
                frag = yaml.safe_load(f)
            if isinstance(frag, dict):
                fragments.append(frag)
    return fragments


def import_into_memory(folder: str, memory: SelfOrganizingMemory) -> None:
    """Import fragments from *folder* into *memory* as entries."""
    fragments = load_conversation_fragments(folder)
    for frag in fragments:
        entry = {
            'time': frag.get('timestamp'),
            'crep': frag.get('crep', 0.5),
            'feedback': frag.get('feedback'),
            'symbol': frag.get('symbol'),
            'strategy': frag.get('strategy'),
            'sealcore_snapshot': frag.get('sealcore_snapshot'),
            'todos': frag.get('todos'),
            'meta': frag.get('meta'),
        }
        memory.add(entry)
