import pytest
from GenesisAeonZIPMEM.agents.archiv_aeon import archive_conversation

def test_archive_empty(tmp_path):
    out = archive_conversation(str(tmp_path))
    assert out == []
