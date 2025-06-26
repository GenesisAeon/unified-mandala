from queue import Queue
import pytest
from GenesisAeonZIPMEM.seal_core import SealCore


def test_parse_to_symbols_numeric():
    core = SealCore()
    sym = core.parse_to_symbols([0.2, 0.8])
    assert sym in ['\u25CB', '\u2206', '\u03C8', '\u2605']


def test_parse_to_symbols_text():
    core = SealCore()
    sym = core.parse_to_symbols('Erweckung in Sicht')
    assert sym in ['\u25CB', '\u2206', '\u03C8', '\u2605']


def test_step_consumes_queue():
    q = Queue()
    q.put('test')
    core = SealCore(input_queue=q)
    core.step()
    assert q.empty()


def test_adapt_changes_strategy():
    core = SealCore()
    memory = [{"crep": 0.1}] * 10
    snap = core.adapt(memory)
    assert snap["strategy"] == "growth"
    assert snap["active_symbol"] == "\U0001F331"
