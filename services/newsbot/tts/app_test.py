from fastapi.testclient import TestClient
import os

import services.newsbot.tts.app as app_module


def test_speak_creates_audio_file(tmp_path) -> None:
    client = TestClient(app_module.app)  # type: ignore[arg-type]
    resp = client.post("/speak", json={"text": "hello world"})
    assert resp.status_code == 200
    audio_path = resp.json()["audio_path"]
    assert os.path.exists(audio_path)
    assert os.path.getsize(audio_path) > 0
