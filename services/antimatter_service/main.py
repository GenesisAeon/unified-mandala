"""Antimatter qubit microservice.

Provides a small helper to fetch the latest
antimatter qubit measurements from a remote API endpoint.
"""

from __future__ import annotations

from typing import Any, Dict

import requests

DEFAULT_API_URL = "https://example.com/antimatter"

def fetch_latest_measurements(api_url: str = DEFAULT_API_URL) -> Dict[str, Any]:
    """Retrieve the latest antimatter qubit measurements.

    Parameters
    ----------
    api_url:
        Endpoint that returns JSON payload with measurement data.

    Returns
    -------
    Dict[str, Any]
        Parsed JSON response from the API.
    """
    response = requests.get(api_url, timeout=10)
    response.raise_for_status()
    return response.json()
