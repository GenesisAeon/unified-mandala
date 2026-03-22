"""Adapter Registry — auto-discovery for all 17 GenesisAeon adapters.

Auto-discovery scans the ``unified_mandala.integrations.adapters`` namespace
package and registers every class that subclasses :class:`BaseAdapter`.
External packages can hook in by installing an entry-point under the group
``unified_mandala.adapters``.

Discovery order:
1. Built-in adapters from ``unified_mandala.integrations.adapters.*``
2. Entry-point adapters (``unified_mandala.adapters`` group)
"""

from __future__ import annotations

import importlib
import importlib.metadata
import pkgutil
from abc import ABC, abstractmethod
from typing import Any

from loguru import logger


class BaseAdapter(ABC):
    """Abstract base for all GenesisAeon adapters.

    Subclasses must implement :meth:`gather` and expose :attr:`name`.
    """

    name: str = ""
    version: str = "0.0.0"

    @abstractmethod
    def gather(self, *, entropy: float, phases: int) -> dict[str, Any]:
        """Collect adapter-specific resonance data.

        Args:
            entropy: Current cycle entropy ∈ [0, 1].
            phases:  Number of phase samples requested.

        Returns:
            Dictionary with at least ``phase`` (float) and ``weight`` (float).
        """

    def health(self) -> bool:
        """Return True when the adapter is operational."""
        return True

    def __repr__(self) -> str:
        return f"<{self.__class__.__name__} name={self.name!r} ver={self.version!r}>"


class AdapterRegistry:
    """Registry of all active GenesisAeon adapters.

    Use :meth:`discover` to auto-populate from the built-in adapter
    package and any installed entry-points.

    Example::

        registry = AdapterRegistry.discover()
        print(len(registry))           # 17
        states = registry.gather_all(entropy=0.6, phases=7)
    """

    def __init__(self) -> None:
        self._adapters: dict[str, BaseAdapter] = {}

    # ------------------------------------------------------------------
    # Registration
    # ------------------------------------------------------------------

    def register(self, adapter: BaseAdapter) -> None:
        """Register an adapter instance.

        Args:
            adapter: Initialised adapter with a non-empty ``name``.

        Raises:
            ValueError: If the adapter name is empty or already registered.
        """
        if not adapter.name:
            raise ValueError("Adapter.name must be non-empty.")
        if adapter.name in self._adapters:
            logger.warning(f"Adapter {adapter.name!r} already registered; overwriting.")
        self._adapters[adapter.name] = adapter
        logger.debug(f"Registered adapter: {adapter!r}")

    def unregister(self, name: str) -> None:
        """Remove an adapter by name."""
        self._adapters.pop(name, None)

    # ------------------------------------------------------------------
    # Discovery
    # ------------------------------------------------------------------

    @classmethod
    def discover(cls) -> AdapterRegistry:
        """Auto-discover all built-in and entry-point adapters.

        Returns:
            Fully populated AdapterRegistry.
        """
        registry = cls()

        # 1. Built-in adapters
        import unified_mandala.integrations.adapters as _pkg

        pkg_path = _pkg.__path__  # type: ignore[attr-defined]
        pkg_name = _pkg.__name__

        for _info in pkgutil.iter_modules(pkg_path):
            mod_name = f"{pkg_name}.{_info.name}"
            try:
                mod = importlib.import_module(mod_name)
            except Exception as exc:
                logger.warning(f"Could not import adapter module {mod_name!r}: {exc}")
                continue

            for attr_name in dir(mod):
                obj = getattr(mod, attr_name)
                if (
                    isinstance(obj, type)
                    and issubclass(obj, BaseAdapter)
                    and obj is not BaseAdapter
                    and obj.name
                ):
                    try:
                        instance = obj()
                        registry.register(instance)
                    except Exception as exc:
                        logger.warning(
                            f"Could not instantiate adapter {attr_name!r}: {exc}"
                        )

        # 2. Entry-point adapters
        try:
            eps = importlib.metadata.entry_points(group="unified_mandala.adapters")
            for ep in eps:
                try:
                    adapter_cls = ep.load()
                    registry.register(adapter_cls())
                except Exception as exc:
                    logger.warning(f"Entry-point adapter {ep.name!r} failed: {exc}")
        except Exception as exc:
            logger.debug(f"Entry-point discovery skipped: {exc}")

        logger.info(f"AdapterRegistry: {len(registry)} adapters discovered.")
        return registry

    # ------------------------------------------------------------------
    # Query
    # ------------------------------------------------------------------

    def gather_all(self, *, entropy: float, phases: int) -> dict[str, Any]:
        """Call :meth:`BaseAdapter.gather` on every registered adapter.

        Args:
            entropy: Cycle entropy input.
            phases:  Phase sample count.

        Returns:
            Mapping of adapter name → gather() result dict.
        """
        states: dict[str, Any] = {}
        for name, adapter in self._adapters.items():
            try:
                states[name] = adapter.gather(entropy=entropy, phases=phases)
            except Exception as exc:
                logger.warning(f"Adapter {name!r} gather() failed: {exc}")
                states[name] = {"phase": 0.0, "weight": 0.0, "error": str(exc)}
        return states

    def get(self, name: str) -> BaseAdapter | None:
        """Retrieve an adapter by name."""
        return self._adapters.get(name)

    @property
    def names(self) -> list[str]:
        """Sorted list of registered adapter names."""
        return sorted(self._adapters.keys())

    def __len__(self) -> int:
        return len(self._adapters)

    def __iter__(self):  # type: ignore[override]
        return iter(self._adapters.values())

    def __contains__(self, name: object) -> bool:
        return name in self._adapters
