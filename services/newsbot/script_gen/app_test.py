from fastapi.testclient import TestClient

import services.newsbot.script_gen.app as app_module


def test_generate_script_fallback() -> None:
    client = TestClient(app_module.app)  # type: ignore[arg-type]
    resp = client.post("/generate", json={"items": [{"title": "A", "summary": "B"}]})
    assert resp.status_code == 200
    assert resp.json()["script"].startswith("- A")


def test_generate_script_openai(monkeypatch) -> None:
    class DummyResp:
        choices = [type("obj", (), {"message": type("msg", (), {"content": "Dummy"})})]

    class DummyChatCompletion:
        @staticmethod
        def create(**kwargs):  # type: ignore[no-untyped-def]
            return DummyResp()

    class DummyOpenAI:
        ChatCompletion = DummyChatCompletion()
        api_key: str

    monkeypatch.setattr(app_module, "openai", DummyOpenAI())
    monkeypatch.setenv("OPENAI_API_KEY", "test")
    client = TestClient(app_module.app)  # type: ignore[arg-type]
    resp = client.post("/generate", json={"items": [{"title": "A", "summary": "B"}]})
    assert resp.status_code == 200
    assert resp.json()["script"] == "Dummy"
