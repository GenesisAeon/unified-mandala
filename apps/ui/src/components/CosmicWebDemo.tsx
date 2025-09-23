import { useEffect, useMemo, useRef, useState } from "react";
import type { Graph } from "@mandala/crep";
import { computeCREP } from "@mandala/crep";

type Feature = {
  geometry: { coordinates: [number, number] };
  properties: { epoch: string; cluster: number };
};

type GraphSource = {
  nodes: { id: string; role: string }[];
  edges: [string, string][];
};

type MetricState = {
  coherence: number;
  resonance: number;
  emergence: number;
  poetics: number;
  crep: number;
};

const fetchJson = async <T,>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}`);
  return (await response.json()) as T;
};

function buildGraph(source: GraphSource): Graph {
  const nodes = source.nodes.map((node) => node.id);
  const labels: Record<string, number> = {};
  source.nodes.forEach((node, index) => {
    labels[node.id] = index % 3;
  });
  const edges = source.edges.map(([sourceId, targetId]) => ({ source: sourceId, target: targetId, weight: 1 }));
  return { nodes, edges, labels };
}

function mutateGraph(graph: Graph): Graph {
  const clone: Graph = {
    nodes: [...graph.nodes],
    labels: graph.labels ? { ...graph.labels } : undefined,
    edges: graph.edges.map((edge) => ({ ...edge })),
  };
  if (clone.nodes.length < 3) return clone;
  const idx = Math.floor(Math.random() * clone.nodes.length);
  const partner = (idx + 2 + Math.floor(Math.random() * (clone.nodes.length - 1))) % clone.nodes.length;
  const source = clone.nodes[idx];
  const target = clone.nodes[partner];
  clone.edges.push({ source, target, weight: 1 });
  return clone;
}

function useGraphRealtime(initial: Graph | null, setGraph: (graph: Graph) => void) {
  const initialised = useRef(false);
  useEffect(() => {
    if (!initial || initialised.current) return;
    initialised.current = true;
    setGraph(initial);
  }, [initial, setGraph]);

  useEffect(() => {
    if (!initial) return;
    let closed = false;
    let cleanup: (() => void) | null = null;

    const apply = (payload: unknown) => {
      if (!payload || typeof payload !== "object") return;
      const graphPayload = (payload as { graph?: Graph }).graph;
      if (!graphPayload) return;
      setGraph({
        nodes: [...graphPayload.nodes],
        edges: graphPayload.edges.map((edge) => ({ ...edge })),
        labels: graphPayload.labels ? { ...graphPayload.labels } : undefined,
      });
    };

    const connectWebSocket = () => {
      try {
        const url = (import.meta as any).env?.VITE_REALTIME_WS ?? "ws://localhost:4020/ws?topic=demo.cosmic";
        const socket = new WebSocket(url);
        socket.onmessage = (event) => {
          try {
            const payload = JSON.parse(String(event.data));
            apply(payload);
          } catch (error) {
            console.warn("[cosmic-web] unable to parse websocket payload", error);
          }
        };
        socket.onclose = () => {
          if (!closed) setTimeout(connectEventSource, 750);
        };
        cleanup = () => socket.close();
        return true;
      } catch (error) {
        console.warn("[cosmic-web] websocket connect failed", error);
        return false;
      }
    };

    const connectEventSource = () => {
      try {
        const url = (import.meta as any).env?.VITE_REALTIME_SSE ?? "http://localhost:4020/sse?topic=demo.cosmic";
        const source = new EventSource(url);
        source.onmessage = (event) => {
          try {
            const payload = JSON.parse(event.data);
            apply(payload);
          } catch (error) {
            console.warn("[cosmic-web] unable to parse sse payload", error);
          }
        };
        source.onerror = () => {
          source.close();
          if (!closed) setTimeout(startLocalLoop, 750);
        };
        cleanup = () => source.close();
        return true;
      } catch (error) {
        console.warn("[cosmic-web] eventsource connect failed", error);
        return false;
      }
    };

    const startLocalLoop = () => {
      let current = initial;
      const timer = setInterval(() => {
        current = mutateGraph(current);
        setGraph(current);
      }, 1600);
      cleanup = () => clearInterval(timer);
    };

    if (!connectWebSocket()) {
      if (!connectEventSource()) {
        startLocalLoop();
      }
    }

    return () => {
      closed = true;
      if (cleanup) cleanup();
    };
  }, [initial, setGraph]);
}

export function CosmicWebDemo() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [points, setPoints] = useState<Feature[]>([]);
  const [epochs, setEpochs] = useState<string[]>([]);
  const [epoch, setEpoch] = useState<string>("ALL");
  const [graphSource, setGraphSource] = useState<GraphSource | null>(null);
  const [graph, setGraph] = useState<Graph | null>(null);
  const previous = useRef<Graph | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const meta = await fetchJson<{ epochs: string[] }>("/demo/cosmic-web/clusters-meta.json");
        setEpochs(["ALL", ...meta.epochs]);
        const fc = await fetchJson<{ features: Feature[] }>("/demo/cosmic-web/clusters.geojson");
        setPoints(fc.features);
        const graphData = await fetchJson<GraphSource>("/demo/cosmic-web/policy-graph.json");
        setGraphSource(graphData);
      } catch (error) {
        console.error("[cosmic-web] failed to load artefacts", error);
      }
    })();
  }, []);

  useGraphRealtime(graphSource ? buildGraph(graphSource) : null, (value) => {
    previous.current = graph;
    setGraph(value);
  });

  const metrics: MetricState | null = useMemo(() => {
    if (!graph) return null;
    return computeCREP(graph, previous.current ?? undefined);
  }, [graph]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, width, height);

    const filtered = epoch === "ALL" ? points : points.filter((feature) => feature.properties.epoch === epoch);
    const margin = 24;
    const scaleX = (value: number) => margin + (value / 10) * (width - margin * 2);
    const scaleY = (value: number) => height - (margin + (value / 10) * (height - margin * 2));

    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
    for (let i = 0; i <= 10; i += 1) {
      const gx = margin + ((width - margin * 2) / 10) * i;
      const gy = margin + ((height - margin * 2) / 10) * i;
      ctx.beginPath();
      ctx.moveTo(gx, margin);
      ctx.lineTo(gx, height - margin);
      ctx.moveTo(margin, gy);
      ctx.lineTo(width - margin, gy);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(96, 165, 250, 0.85)";
    for (const feature of filtered) {
      const [x, y] = feature.geometry.coordinates;
      const radius = 1.5 + (feature.properties.cluster % 3);
      ctx.beginPath();
      ctx.arc(scaleX(x), scaleY(y), radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [points, epoch]);

  return (
    <div className="flex flex-col gap-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Cosmic-Web Demo</h1>
        <p className="text-sm text-slate-500">
          Clustertracer skizzieren eine latente Governance-Struktur. Daten und Graph stammen aus synthetischen Artefakten.
        </p>
      </header>
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium" htmlFor="epoch-select">
              Epoche
            </label>
            <select
              id="epoch-select"
              className="rounded border border-slate-300 px-2 py-1 text-sm"
              value={epoch}
              onChange={(event) => setEpoch(event.target.value)}
            >
              {epochs.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white shadow">
            <canvas ref={canvasRef} className="h-[420px] w-full rounded-2xl" />
          </div>
        </section>
        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow">
            <h2 className="text-lg font-semibold">CREP</h2>
            {metrics ? (
              <dl className="mt-3 space-y-2 text-sm">
                <Metric label="Coherence" value={metrics.coherence} />
                <Metric label="Resonance" value={metrics.resonance} />
                <Metric label="Emergence" value={metrics.emergence} />
                <Metric label="Poetics" value={metrics.poetics} />
                <Metric label="CREP" value={metrics.crep} highlight />
              </dl>
            ) : (
              <p className="text-sm text-slate-500">Lade Metriken …</p>
            )}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow">
            <h2 className="text-lg font-semibold">Policy/Data Kanten</h2>
            {graphSource ? (
              <ul className="mt-2 space-y-1 text-xs font-mono">
                {graphSource.edges.map(([a, b], index) => (
                  <li key={`${a}-${b}-${index}`}>{`${a} → ${b}`}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">Lade Graph …</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Metric({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
      <span className="text-slate-600">{label}</span>
      <span className={`font-mono ${highlight ? "text-slate-900" : "text-slate-700"}`}>{value.toFixed(3)}</span>
    </div>
  );
}
