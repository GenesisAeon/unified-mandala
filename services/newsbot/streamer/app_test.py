from fastapi.testclient import TestClient
import services.newsbot.streamer.app as app_module


def test_stream_returns_status() -> None:
    client = TestClient(app_module.app)  # type: ignore[arg-type]
    resp = client.post("/stream", json={"video_path": "/tmp/news_video.mp4"})
    assert resp.status_code == 200
    assert resp.json()["status"] == "streaming"
