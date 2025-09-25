import React, { useEffect, useMemo, useState } from 'react';

export interface MandalaNode {
  id: string;
  x: number;
  y: number;
  label?: string;
}

export interface MandalaEdge {
  id: string;
  source: string;
  target: string;
  strength?: number;
}

interface GlowState {
  id: string;
  timestamp: number;
}

export interface MandalaMapProps {
  nodes?: MandalaNode[];
  edges?: MandalaEdge[];
  width?: number;
  height?: number;
  highlightOnHover?: boolean;
  showLabels?: boolean;
  edgeOpacity?: number;
  eventSourceUrl?: string | null;
  glowDurationMs?: number;
  enableLegacy?: boolean;
}

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 400;
const DEFAULT_EVENT_SOURCE = 'http://localhost:4020/sse';

const DEFAULT_NODES: MandalaNode[] = [
  { id: 'core', x: 300, y: 200, label: 'Core Runtime' },
  { id: 'agents', x: 160, y: 90, label: 'Agents' },
  { id: 'governance', x: 460, y: 90, label: 'Governance' },
  { id: 'observability', x: 520, y: 260, label: 'Observability' },
  { id: 'automation', x: 300, y: 340, label: 'Automation' },
  { id: 'testing', x: 110, y: 280, label: 'Testing' },
];

const buildDefaultEdges = (nodes: MandalaNode[]): MandalaEdge[] => {
  if (nodes.length < 2) return [];
  const edges: MandalaEdge[] = [];
  for (let i = 1; i < nodes.length; i += 1) {
    const previous = nodes[i - 1];
    const current = nodes[i];
    edges.push({ id: `edge-${previous.id}-${current.id}`, source: previous.id, target: current.id });
  }
  // connect back to core for a closed resonance loop
  edges.push({ id: 'edge-last-core', source: nodes[nodes.length - 1].id, target: nodes[0].id });
  return edges;
};

const isBrowser = typeof window !== 'undefined';

const MandalaMap: React.FC<MandalaMapProps> = ({
  nodes: providedNodes,
  edges: providedEdges,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  highlightOnHover = true,
  showLabels = true,
  edgeOpacity = 0.35,
  eventSourceUrl,
  glowDurationMs = 2500,
  enableLegacy,
}) => {
  const [legacyQuery] = useState(() => {
    if (!isBrowser) return false;
    try {
      return new URLSearchParams(window.location.search).has('legacy');
    } catch (error) {
      console.warn('MandalaMap: unable to parse query string', error);
      return false;
    }
  });

  const legacyEnabled = enableLegacy ?? legacyQuery;

  const nodes = useMemo<MandalaNode[]>(() => {
    if (providedNodes && providedNodes.length > 0) {
      return providedNodes;
    }
    return DEFAULT_NODES;
  }, [providedNodes]);

  const edges = useMemo<MandalaEdge[]>(() => {
    if (providedEdges && providedEdges.length > 0) {
      return providedEdges;
    }
    return buildDefaultEdges(nodes);
  }, [nodes, providedEdges]);

  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [glowState, setGlowState] = useState<GlowState | null>(null);
  const [glowProgress, setGlowProgress] = useState(0);

  useEffect(() => {
    if (!glowState || glowDurationMs <= 0 || !isBrowser) {
      setGlowProgress(0);
      return undefined;
    }

    setGlowProgress(1);
    let animationFrame = 0;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      const elapsed = Date.now() - glowState.timestamp;
      const ratio = Math.max(0, 1 - elapsed / glowDurationMs);
      setGlowProgress(ratio);
      if (ratio > 0) {
        animationFrame = window.requestAnimationFrame(tick);
      }
    };

    animationFrame = window.requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [glowState, glowDurationMs]);

  useEffect(() => {
    if (!legacyEnabled || !isBrowser) {
      return undefined;
    }

    const targetUrl = eventSourceUrl === undefined ? DEFAULT_EVENT_SOURCE : eventSourceUrl;
    const hasEventSource = typeof window.EventSource === 'function';
    let eventSource: EventSource | null = null;
    let fallbackTimer: number | null = null;

    if (targetUrl && hasEventSource) {
      try {
        eventSource = new window.EventSource(targetUrl);
        eventSource.onmessage = (evt) => {
          try {
            const payload = JSON.parse(evt.data);
            const candidate = payload?.nodeId ?? payload?.id ?? payload?.target ?? payload?.source;
            if (candidate && nodes.some((node) => node.id === candidate)) {
              setGlowState({ id: candidate, timestamp: Date.now() });
            }
          } catch (error) {
            console.warn('MandalaMap: unable to parse SSE payload', error);
          }
        };
      } catch (error) {
        console.warn('MandalaMap: unable to open EventSource', error);
        eventSource = null;
      }
    }

    if (!eventSource) {
      let index = 0;
      fallbackTimer = window.setInterval(() => {
        if (!nodes.length) return;
        const node = nodes[index % nodes.length];
        setGlowState({ id: node.id, timestamp: Date.now() });
        index += 1;
      }, 4000);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      if (fallbackTimer) {
        window.clearInterval(fallbackTimer);
      }
    };
  }, [legacyEnabled, eventSourceUrl, nodes]);

  const connectedNodes = useMemo(() => {
    if (!hoveredNode) return new Set<string>();
    const related = new Set<string>([hoveredNode]);
    edges.forEach((edge) => {
      if (edge.source === hoveredNode) related.add(edge.target);
      if (edge.target === hoveredNode) related.add(edge.source);
    });
    return related;
  }, [edges, hoveredNode]);

  const miniMapScale = 0.25;
  const miniWidth = width * miniMapScale;
  const miniHeight = height * miniMapScale;

  const showLegacyToggles = legacyEnabled || highlightOnHover === false || showLabels === false;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: width,
        margin: '0 auto',
      }}
    >
      <svg
        width={width}
        height={height}
        aria-label="Mandala Map"
        role="img"
        style={{ background: '#0b1120', borderRadius: 12, boxShadow: '0 20px 40px rgba(15, 23, 42, 0.35)' }}
        onMouseLeave={() => setHoveredNode(null)}
      >
        <defs>
          <radialGradient id="mandala-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#facc15" stopOpacity={0.9} />
            <stop offset="60%" stopColor="#facc15" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#facc15" stopOpacity={0} />
          </radialGradient>
        </defs>

        {edges.map((edge) => {
          const source = nodes.find((node) => node.id === edge.source);
          const target = nodes.find((node) => node.id === edge.target);
          if (!source || !target) return null;

          const active = highlightOnHover && hoveredNode && (edge.source === hoveredNode || edge.target === hoveredNode);

          return (
            <line
              key={edge.id}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke={active ? '#38bdf8' : '#1e293b'}
              strokeWidth={active ? 2.4 : 1.2}
              strokeOpacity={hoveredNode ? (active ? 0.85 : edgeOpacity * 0.4) : edgeOpacity}
              strokeDasharray={edge.strength ? `${Math.max(2, 6 - edge.strength * 4)} ${Math.max(3, edge.strength * 12)}` : undefined}
            />
          );
        })}

        {nodes.map((node) => {
          const glowing = glowState?.id === node.id;
          const glowStrength = glowing ? glowProgress : 0;
          const isConnected = connectedNodes.has(node.id);
          const radius = node.id === 'core' ? 16 : 12;

          return (
            <g
              key={node.id}
              transform={`translate(${node.x},${node.y})`}
              onMouseEnter={() => {
                if (highlightOnHover) setHoveredNode(node.id);
              }}
            >
              {glowing && (
                <circle r={radius + 18} fill="url(#mandala-glow)" opacity={Math.max(0, glowStrength)} />
              )}
              <circle
                r={radius}
                fill={glowing ? '#f97316' : isConnected ? '#38bdf8' : '#4a90e2'}
                stroke="#0f172a"
                strokeWidth={2}
                style={{ transition: 'fill 160ms ease, transform 160ms ease' }}
              />
              {(showLabels || legacyEnabled) && node.label && (
                <text x={0} y={-(radius + 12)} textAnchor="middle" fontSize={11} fill="#e2e8f0">
                  {node.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {legacyEnabled && (
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'rgba(15, 23, 42, 0.88)',
            color: '#fef9c3',
            padding: '12px 16px',
            borderRadius: 10,
            fontSize: 12,
            boxShadow: '0 12px 24px rgba(15, 23, 42, 0.35)',
            maxWidth: 220,
            lineHeight: 1.35,
          }}
        >
          <strong style={{ display: 'block', marginBottom: 4 }}>Legacy overlay active</strong>
          <span>
            Edge highlighting, mini-map and event glow are unlocked. Append <code>?legacy=1</code> to toggle locally.
          </span>
        </div>
      )}

      {(legacyEnabled || showLegacyToggles) && (
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            width: miniWidth,
            height: miniHeight,
            borderRadius: 12,
            background: 'rgba(15, 23, 42, 0.92)',
            padding: 8,
            boxShadow: '0 18px 28px rgba(2, 6, 23, 0.4)',
            color: '#e2e8f0',
            fontSize: 11,
          }}
        >
          <div style={{ marginBottom: 6, fontWeight: 600 }}>Mini-Map</div>
          <svg width={miniWidth - 16} height={miniHeight - 16} viewBox={`0 0 ${width} ${height}`}>
            {edges.map((edge) => {
              const source = nodes.find((node) => node.id === edge.source);
              const target = nodes.find((node) => node.id === edge.target);
              if (!source || !target) return null;
              return (
                <line
                  key={`mini-${edge.id}`}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke="#1e293b"
                  strokeWidth={2}
                  strokeOpacity={0.55}
                />
              );
            })}
            {nodes.map((node) => {
              const glowing = glowState?.id === node.id;
              return (
                <circle
                  key={`mini-${node.id}`}
                  cx={node.x}
                  cy={node.y}
                  r={node.id === 'core' ? 9 : 6}
                  fill={glowing ? '#f97316' : '#64748b'}
                  opacity={hoveredNode && connectedNodes.has(node.id) ? 0.95 : 0.7}
                />
              );
            })}
          </svg>
        </div>
      )}
    </div>
  );
};

export default MandalaMap;

