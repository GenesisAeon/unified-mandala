from fastapi.testclient import TestClient
import services.newsbot.avatar_renderer.app as app_module


def test_render_returns_video_path() -> None:
    client = TestClient(app_module.app)  # type: ignore[arg-type]
    resp = client.post("/render", json={"audio_path": "/tmp/example.mp3"})
    assert resp.status_code == 200
    assert resp.json()["video_path"] == "/tmp/news_video.mp4"
