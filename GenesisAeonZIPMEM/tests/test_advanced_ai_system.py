from GenesisAeonZIPMEM.advanced_ai_system import AdvancedAISelfLearnSystem


def test_mainloop_adds_entry():
    system = AdvancedAISelfLearnSystem()
    result = system.mainloop(feedback=0.6)
    assert system.memory.entries
    assert result["sealcore_snapshot"]
    assert isinstance(result["haiku"], str)
