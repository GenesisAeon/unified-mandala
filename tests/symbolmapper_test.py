from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parents[0].parent))

from agents.symbolmapper.main import SymbolMapper


def test_map_numeric_to_symbol():
    mapper = SymbolMapper()
    assert mapper.map_numeric_to_symbol([0.1, 0.9]) == "ψ"


def test_map_text_to_glyph():
    mapper = SymbolMapper()
    assert mapper.map_text_to_glyph("Eine Erweckung steht bevor") == "★"
    assert mapper.map_text_to_glyph("Unbekannt") == "○"
