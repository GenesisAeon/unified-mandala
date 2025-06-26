from GenesisAeonZIPMEM.aeon_seal_ai import AeonSealAI


def test_process_creates_memory_entry():
    ai = AeonSealAI()
    result = ai.process("hello", feedback=0.7)
    assert ai.memory.entries
    assert result["sealcore_snapshot"]
    assert isinstance(result["haiku"], str)
