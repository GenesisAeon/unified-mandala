from __future__ import annotations

import orchestrator.newsbot_orchestrator as orchestrator


class DummyResp:
    def __init__(self, data):
        self._data = data

    def json(self):
        return self._data


def test_run_pipeline(monkeypatch) -> None:
    def fake_get(url, *args, **kwargs):
        assert url.endswith("/fetch")
        return DummyResp({"items": [{"title": "t", "summary": "s"}]})

    def fake_post(url, json=None, *args, **kwargs):
        if url.endswith("/generate"):
            assert json == {"items": [{"title": "t", "summary": "s"}]}
            return DummyResp({"script": "script text"})
        if url.endswith("/speak"):
            assert json == {"text": "script text"}
            return DummyResp({"audio_path": "/tmp/out.mp3"})
        raise AssertionError("unexpected url")

    monkeypatch.setattr(orchestrator.requests, "get", fake_get)
    monkeypatch.setattr(orchestrator.requests, "post", fake_post)

    result = orchestrator.run_pipeline()
    assert result["items"][0]["title"] == "t"
    assert result["script"] == "script text"
    assert result["audio_path"] == "/tmp/out.mp3"
