# ERA5 Adapter (Live → STAC → MRV → CREP)

## Setup
- Python 3.10+
- `pip install -r src/adapters/era5/requirements.txt`
- `.env` mit `CDS_API_URL` und `CDS_API_KEY`

## Pipeline
1. fetch.py → `data/raw/*.nc`
2. stac.py  → `data/stac/*.json`
3. resample.py → `data/processed/*.nc`
4. mrv.py → `data/mrv/*.parquet`
5. crep_score.py → Score (0..1)

## Ausführung
`pnpm adapter:build:era5` (siehe Scripts)

## Hinweise
- API-Limits beachten; bei Bedarf `cache.py` aktivieren.
- Variablen/Zeiträume in `scripts/build-adapter-era5.mjs` steuern.
