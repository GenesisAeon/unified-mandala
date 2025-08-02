"""Tests for the antimatter qubit microservice."""

from unittest.mock import MagicMock, patch
from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parent.parent))
from antimatter_service.main import fetch_latest_measurements  # type: ignore


def test_fetch_latest_measurements_returns_json() -> None:
    """Ensure the helper returns parsed JSON data."""
    mock_response = MagicMock()
    mock_response.json.return_value = {"value": 3.14}
    mock_response.raise_for_status.return_value = None

    with patch("antimatter_service.main.requests.get", return_value=mock_response) as mock_get:
        data = fetch_latest_measurements("http://test/api")

        assert data == {"value": 3.14}
        mock_get.assert_called_once_with("http://test/api", timeout=10)
