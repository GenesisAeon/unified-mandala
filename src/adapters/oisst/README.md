# OISST Adapter (Live → STAC → MRV → CREP)

## Setup
- Python 3.10+
- `pip install -r src/adapters/oisst/requirements.txt`
- Offline-Modus nutzt Fixture `tests/fixtures/oisst/oisst_sample.nc`

## Pipeline
1. fetch_oisst.py → `data/raw/*.nc`
2. stac.py → `data/stac/*.json`
3. resample.py → `data/processed/*.nc`
4. mrv.py → `data/mrv/*.parquet`
5. crep_score.py → Score (0..1)

## Ausführung
`pnpm adapter:build:oisst` (siehe Scripts)
