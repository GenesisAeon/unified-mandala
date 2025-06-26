from GenesisAeonZIPMEM.agents.symbol_mapper import map_numeric_to_symbol

def test_symbol_range():
    sym = map_numeric_to_symbol([0.1, 0.9])
    assert sym in ['\u25CB', '\u2206', '\u03C8', '\u2605']
