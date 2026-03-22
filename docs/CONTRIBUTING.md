# Contributing

Thank you for contributing to **unified-mandala**!

## Development Setup

```bash
git clone https://github.com/GenesisAeon/unified-mandala
cd unified-mandala
pip install -e ".[dev,full-stack]"
```

## Running Tests

```bash
pytest tests/python/ -v
```

## Linting

```bash
ruff check src/ tests/python/
ruff format src/ tests/python/
```

## Type Checking

```bash
mypy src/unified_mandala
```

## Docs

```bash
mkdocs serve
```

## Adding a New Adapter

1. Create `src/unified_mandala/integrations/adapters/my_adapter.py`
2. Subclass `BaseAdapter`
3. Set `name` and `version` class attributes
4. Implement `gather(*, entropy, phases) -> dict`
5. Add contract tests in `tests/python/contract/`

## Code of Conduct

This project follows a welcoming, inclusive Code of Conduct.
All contributors are expected to be respectful and constructive.
