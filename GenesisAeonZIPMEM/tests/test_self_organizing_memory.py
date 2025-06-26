from GenesisAeonZIPMEM.self_organizing_memory import SelfOrganizingMemory


def test_review_calculates_average():
    mem = SelfOrganizingMemory()
    for i in range(10):
        mem.add({"crep": i / 10, "symbol": "\u25CB"})
    result = mem.review()
    assert abs(result["avg_crep"] - 0.45) < 1e-6
    assert result["symbol_counts"]["\u25CB"] == 10


def test_snapshot_roundtrip(tmp_path):
    mem = SelfOrganizingMemory()
    mem.add({"crep": 0.2, "symbol": "\u2605"})
    path = tmp_path / "snap.yaml"
    mem.export_snapshot(str(path))
    new_mem = SelfOrganizingMemory()
    new_mem.import_snapshot(str(path))
    assert new_mem.entries[0].symbol == "\u2605"
