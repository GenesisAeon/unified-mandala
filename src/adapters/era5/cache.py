from __future__ import annotations

import requests_cache  # type: ignore[import]

# pyright: reportUnknownMemberType=false


def enable_cache() -> None:
    requests_cache.install_cache(
        "era5_cache",
        expire_after=60 * 60 * 24 * 7,  # 7 Tage
        allowable_methods=("GET", "POST"),
    )
