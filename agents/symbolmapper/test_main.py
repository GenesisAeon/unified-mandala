import pytest
from .main import map_numeric_to_symbol, map_text_to_glyph, SymbolMapper


def test_map_numeric_to_symbol_basic():
    assert map_numeric_to_symbol([0.1, 0.9]) == "ψ"
    assert map_numeric_to_symbol([1.0]) == "★"


def test_map_numeric_to_symbol_empty():
    with pytest.raises(ValueError):
        map_numeric_to_symbol([])


def test_map_text_to_glyph():
    assert map_text_to_glyph("Eine große Erweckung naht") == "★"
    assert map_text_to_glyph("unspecific text") == "○"


def test_symbolmapper_class():
    mapper = SymbolMapper()
    assert mapper.map_numeric([0.2, 0.2]) == "○"
    assert mapper.map_text("psi signal") == "ψ"
