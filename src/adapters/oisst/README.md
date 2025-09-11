# OISST Adapter
**Datenquelle**: [NOAA MUR SST](https://coastwatch.pfeg.noaa.gov/erddap/griddap/jplMURSST41.html)

## Pipeline
1. **Fetch**: Lädt NetCDF von ERDDAP (oder nutzt Fixture in CI).
2. **Resample**: Reduziert Auflösung auf 0.5° × 0.5°.
3. **STAC**: Generiert Metadaten nach [SpatioTemporal Asset Catalog](https://stacspec.org).
4. **MRV**: Konvertiert zu Parquet für Monitoring/Reporting/Verification.
5. **CREP**: Bewertet Aktualität (70%) + Datenabdeckung (30%).

## CI
- Nutzt in GitHub Actions **immer Fixtures** (`CI=true`).
- Fixture: `tests/fixtures/oisst_sample.nc`.
