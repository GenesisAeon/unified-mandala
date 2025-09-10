import requests_cache

def enable_cache():
    requests_cache.install_cache(
        "era5_cache",
        expire_after=60 * 60 * 24 * 7,  # 7 Tage
        allowable_methods=("GET", "POST"),
    )
