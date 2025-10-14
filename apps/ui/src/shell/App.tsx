import { useMemo } from 'react';
import { useClimateConfig } from '../config/useClimateConfig';
import KpiBoard from '../components/KpiBoard';
import OpsPanel from '../components/OpsPanel';
import { CosmicWebDemo } from '../components/CosmicWebDemo';
import MandalaAIPlayground from '../components/MandalaAIPlayground';
import RagPlayground from '../components/RagPlayground';
import RumTopbarToggle from '../components/RumTopbarToggle';
import BoundaryDemo from '../pages/BoundaryDemo';

export default function App() {
  const route = useMemo(() => {
    if (typeof window === 'undefined') return '/';
    return window.location.pathname;
  }, []);

  const normalizedRoute = route.replace(/\/+$/, '') || '/';

  if (normalizedRoute.startsWith('/demo/ai-playground')) {
    return (
      <main className="min-h-screen bg-slate-100 p-6">
        <nav className="mb-6 flex items-center gap-4 text-sm text-slate-600">
          <a
            className="rounded-lg border border-transparent px-3 py-1 transition hover:border-indigo-200 hover:text-indigo-600"
            href="/"
          >
            ← Zurück zum Dashboard
          </a>
          <a
            className="rounded-lg border border-transparent px-3 py-1 transition hover:border-indigo-200 hover:text-indigo-600"
            href="/demo/cosmic-web"
          >
            Cosmic-Web Demo
          </a>
          <RumTopbarToggle />
        </nav>
        <MandalaAIPlayground />
      </main>
    );
  }

  if (normalizedRoute.startsWith('/demo/cosmic-web')) {
    return (
      <main className="min-h-screen bg-slate-100 p-6">
        <nav className="mb-6 flex items-center gap-4 text-sm text-slate-600">
          <a
            className="rounded-lg border border-transparent px-3 py-1 transition hover:border-indigo-200 hover:text-indigo-600"
            href="/"
          >
            ← Zurück zum Dashboard
          </a>
          <a
            className="rounded-lg border border-transparent px-3 py-1 transition hover:border-indigo-200 hover:text-indigo-600"
            href="/demo/ai-playground"
          >
            AI Playground
          </a>
        </nav>
        <CosmicWebDemo />
      </main>
    );
  }

  if (normalizedRoute.startsWith('/demo/boundary')) {
    return (
      <main className="min-h-screen bg-slate-100 p-6">
        <nav className="mb-6 flex items-center gap-4 text-sm text-slate-600">
          <a
            className="rounded-lg border border-transparent px-3 py-1 transition hover:border-indigo-200 hover:text-indigo-600"
            href="/"
          >
            ← Zurück zum Dashboard
          </a>
          <a
            className="rounded-lg border border-transparent px-3 py-1 transition hover:border-indigo-200 hover:text-indigo-600"
            href="/demo/ai-playground"
          >
            AI Playground
          </a>
          <a
            className="rounded-lg border border-transparent px-3 py-1 transition hover:border-indigo-200 hover:text-indigo-600"
            href="/demo/cosmic-web"
          >
            Cosmic-Web Demo
          </a>
        </nav>
        <BoundaryDemo />
      </main>
    );
  }

  if (normalizedRoute.startsWith('/demo/rag-playground')) {
    return (
      <main className="min-h-screen bg-slate-100 p-6">
        <nav className="mb-6 flex items-center gap-4 text-sm text-slate-600">
          <a
            className="rounded-lg border border-transparent px-3 py-1 transition hover:border-indigo-200 hover:text-indigo-600"
            href="/"
          >
            ← Zurück zum Dashboard
          </a>
          <a
            className="rounded-lg border border-transparent px-3 py-1 transition hover:border-indigo-200 hover:text-indigo-600"
            href="/demo/ai-playground"
          >
            AI Playground
          </a>
          <a
            className="rounded-lg border border-transparent px-3 py-1 transition hover:border-indigo-200 hover:text-indigo-600"
            href="/demo/cosmic-web"
          >
            Cosmic-Web Demo
          </a>
        </nav>
        <RagPlayground />
      </main>
    );
  }

  const cfg = useClimateConfig();
  return (
    <div style={{ padding: 16 }}>
      <nav style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
        <a href="/demo/cosmic-web" style={{ textDecoration: 'none', color: '#2563eb' }}>
          Cosmic-Web Demo
        </a>
        <a href="/demo/ai-playground" style={{ textDecoration: 'none', color: '#2563eb' }}>
          AI Playground
        </a>
        <a href="/demo/rag-playground" style={{ textDecoration: 'none', color: '#2563eb' }}>
          RAG Playground
        </a>
      </nav>
      <h1 style={{ margin: '8px 0 16px' }}>Mandala Climate Dashboard</h1>
      <h2 style={{ margin: '0 0 8px', fontSize: 16, color: '#333' }}>KPIs (live, aus Config)</h2>
      <OpsPanel />
      <KpiBoard kpis={cfg.kpis} />
    </div>
  );
}
