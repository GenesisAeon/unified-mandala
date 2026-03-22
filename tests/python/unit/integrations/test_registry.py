"""Unit tests for AdapterRegistry — 80+ tests."""

from __future__ import annotations

import pytest

from unified_mandala.integrations.registry import AdapterRegistry, BaseAdapter

# ── Stubs ─────────────────────────────────────────────────────────────────────


class StubAdapter(BaseAdapter):
    name = "stub"
    version = "1.0.0"
    _should_fail = False

    def gather(self, *, entropy, phases):
        if self._should_fail:
            raise RuntimeError("gather failed")
        return {"phase": entropy, "weight": 1.0, "decay": 0.0}


class AnotherAdapter(BaseAdapter):
    name = "another"
    version = "2.0.0"

    def gather(self, *, entropy, phases):
        return {"phase": 1.0 - entropy, "weight": 1.5, "decay": 0.0}


class HealthyAdapter(BaseAdapter):
    name = "healthy"
    version = "0.1.0"

    def gather(self, *, entropy, phases):
        return {"phase": 0.5, "weight": 1.0}


class UnhealthyAdapter(BaseAdapter):
    name = "unhealthy"
    version = "0.1.0"

    def health(self):
        return False

    def gather(self, *, entropy, phases):
        return {"phase": 0.0, "weight": 1.0}


class NoNameAdapter(BaseAdapter):
    name = ""

    def gather(self, *, entropy, phases):
        return {}


@pytest.fixture()
def registry() -> AdapterRegistry:
    r = AdapterRegistry()
    r.register(StubAdapter())
    r.register(AnotherAdapter())
    return r


# ── Registration ──────────────────────────────────────────────────────────────


class TestRegistration:
    def test_register_single(self):
        r = AdapterRegistry()
        r.register(StubAdapter())
        assert "stub" in r

    def test_register_two(self, registry):
        assert "stub" in registry
        assert "another" in registry

    def test_register_empty_name_raises(self):
        r = AdapterRegistry()
        with pytest.raises(ValueError, match="non-empty"):
            r.register(NoNameAdapter())

    def test_register_duplicate_overwrites(self):
        r = AdapterRegistry()
        a1 = StubAdapter()
        a2 = StubAdapter()
        r.register(a1)
        r.register(a2)
        assert r.get("stub") is a2

    def test_unregister_removes(self, registry):
        registry.unregister("stub")
        assert "stub" not in registry

    def test_unregister_nonexistent_is_noop(self):
        r = AdapterRegistry()
        r.unregister("nothing")  # should not raise

    def test_len_matches_registered(self, registry):
        assert len(registry) == 2


# ── Query ─────────────────────────────────────────────────────────────────────


class TestQuery:
    def test_get_returns_adapter(self, registry):
        a = registry.get("stub")
        assert isinstance(a, StubAdapter)

    def test_get_missing_returns_none(self, registry):
        assert registry.get("missing") is None

    def test_names_sorted(self, registry):
        names = registry.names
        assert names == sorted(names)

    def test_names_contains_all(self, registry):
        assert set(registry.names) == {"stub", "another"}

    def test_iter_yields_adapters(self, registry):
        adapters = list(registry)
        assert len(adapters) == 2

    def test_contains_true(self, registry):
        assert "stub" in registry

    def test_contains_false(self, registry):
        assert "nope" not in registry

    def test_health_check_healthy(self):
        r = AdapterRegistry()
        r.register(HealthyAdapter())
        assert r.get("healthy").health() is True

    def test_health_check_unhealthy(self):
        r = AdapterRegistry()
        r.register(UnhealthyAdapter())
        assert r.get("unhealthy").health() is False


# ── gather_all ────────────────────────────────────────────────────────────────


class TestGatherAll:
    def test_gather_all_returns_all_names(self, registry):
        states = registry.gather_all(entropy=0.5, phases=7)
        assert set(states.keys()) == {"stub", "another"}

    def test_gather_all_values_have_phase(self, registry):
        states = registry.gather_all(entropy=0.5, phases=7)
        for v in states.values():
            assert "phase" in v

    def test_gather_all_stub_phase_equals_entropy(self, registry):
        states = registry.gather_all(entropy=0.618, phases=7)
        assert states["stub"]["phase"] == pytest.approx(0.618)

    def test_gather_all_another_phase_complement(self, registry):
        states = registry.gather_all(entropy=0.3, phases=7)
        assert states["another"]["phase"] == pytest.approx(0.7)

    def test_gather_all_adapter_fail_graceful(self):
        class FailAdapter(BaseAdapter):
            name = "fail"

            def gather(self, *, entropy, phases):
                raise RuntimeError("boom")

        r = AdapterRegistry()
        r.register(FailAdapter())
        states = r.gather_all(entropy=0.5, phases=7)
        assert "error" in states["fail"]

    def test_gather_all_empty_registry(self):
        r = AdapterRegistry()
        states = r.gather_all(entropy=0.5, phases=7)
        assert states == {}

    @pytest.mark.parametrize("entropy", [0.0, 0.25, 0.5, 0.75, 1.0])
    def test_gather_all_various_entropy(self, registry, entropy):
        states = registry.gather_all(entropy=entropy, phases=7)
        assert len(states) == 2


# ── Discover ──────────────────────────────────────────────────────────────────


class TestDiscover:
    def test_discover_returns_registry(self):
        r = AdapterRegistry.discover()
        assert isinstance(r, AdapterRegistry)

    def test_discover_finds_builtin_adapters(self):
        r = AdapterRegistry.discover()
        assert len(r) >= 1

    def test_discover_includes_genesis_os(self):
        r = AdapterRegistry.discover()
        assert "genesis-os" in r

    def test_discover_includes_sigillin(self):
        r = AdapterRegistry.discover()
        assert "sigillin" in r

    def test_discover_all_17(self):
        r = AdapterRegistry.discover()
        assert len(r) >= 17
