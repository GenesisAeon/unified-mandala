# Quick Start

## Installation

```bash
pip install <package-name>
```

## Development Setup

```bash
git clone https://github.com/GenesisAeon/<repo-name>.git
cd <repo-name>
pip install -e ".[dev]"
```

## Running Tests

```bash
pytest --cov=src
```

## Linting

```bash
ruff check src tests
mypy src
```

## Building Docs

```bash
mkdocs serve
```

## Release

Tag a commit to trigger the automated release workflow:

```bash
git tag v0.1.0
git push origin v0.1.0
```

The release workflow will:
1. Build the wheel + sdist
2. Publish to PyPI via Trusted Publishing (no token needed)
3. Create a GitHub Release with auto-generated notes
4. Trigger Zenodo archival (configure `ZENODO_TOKEN` secret)

---
*Propagated from [diamond-setup](https://github.com/GenesisAeon/diamond-setup) v0.3.0.*
