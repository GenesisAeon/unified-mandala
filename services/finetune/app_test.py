from fastapi.testclient import TestClient
from services.finetune.app import app as finetune_app


def test_finetune_endpoint(tmp_path, monkeypatch):
    client = TestClient(finetune_app)  # type: ignore[arg-type]

    def fake_load_recent_samples():
        return [{"text": "sample"}]

    def fake_run_lora_finetune(base_model, data, output_dir):
        model_file = tmp_path / "model.bin"
        model_file.write_text("ok")
        return str(model_file)

    monkeypatch.setattr("services.finetune.app.load_recent_samples", fake_load_recent_samples)
    monkeypatch.setattr("services.finetune.app.run_lora_finetune", fake_run_lora_finetune)

    resp = client.post("/finetune", json={"base_model": "test", "output_dir": str(tmp_path)})
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "finetuned"
    assert data["model_path"].endswith("model.bin")
