import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { Tooltip } from "react-tooltip";

// Annahme: sigillin_nodes.json ist bereits im Projekt und importierbar
import rawNodesData from "../data/sigillin_nodes.json";
import { getCREPPhaseColor } from "../../shared-utils";

interface MandalaNode {
  id: string;
  label: string;
  crep: { C: number; R: number; E: number; P: number };
  related: Array<{ id: string; relation: string }>;
  type: string;
  status: string;
  model?: string;
  poetry?: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}


const colorForCREP = ({ C, R, E }: MandalaNode["crep"]) =>
  getCREPPhaseColor({ C, R, E });

export const MandalaNetworkView: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterModel, setFilterModel] = useState<string>('all');
  const [selectedNode, setSelectedNode] = useState<MandalaNode | null>(null);
  const nodesData = rawNodesData as MandalaNode[];
  // verfügbare Sigillin-Typen für die Filter-UI ermitteln
  const types = Array.from(new Set(nodesData.map(n => n.type)));
  const models = Array.from(new Set(nodesData.map(n => n.model).filter(Boolean))) as string[];

  useEffect(() => {
    // D3-Force-Simulation
    const width = 800, height = 600;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const nodes: MandalaNode[] = nodesData.filter(n => {
      if (filterType !== 'all' && n.type !== filterType) return false;
      const sum = n.crep.C + n.crep.R + n.crep.E + n.crep.P;
      if (filterLevel === 'low' && sum >= 10) return false;
      if (filterLevel === 'medium' && (sum < 10 || sum > 20)) return false;
      if (filterLevel === 'high' && sum <= 20) return false;
      if (filterModel !== 'all' && n.model !== filterModel) return false;
      return true;
    });
    const links = nodes.flatMap(n =>
      (n.related || []).map(r => ({
        source: n.id,
        target: r.id,
        relation: r.relation,
      }))
    ) as Array<{ source: string; target: string; relation: string }>;

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg
      .append("g")
      .attr("stroke", "#bbb")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke-width", 2);

    const node = svg
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 24)
      .attr("fill", (d: MandalaNode) => colorForCREP(d.crep))
      .attr("stroke", "#222")
      .attr("stroke-width", 2)
      .attr("data-tooltip-id", "node-tooltip")
      .attr(
        "data-tooltip-content",
        d => `${d.label}\nC:${d.crep.C} R:${d.crep.R} E:${d.crep.E} P:${d.crep.P}\n${d.poetry ?? ''}`
      )
      .call(
        d3
          .drag<SVGCircleElement, MandalaNode>()
          .on("start", (event: d3.D3DragEvent<SVGCircleElement, MandalaNode, unknown>, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event: d3.D3DragEvent<SVGCircleElement, MandalaNode, unknown>, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event: d3.D3DragEvent<SVGCircleElement, MandalaNode, unknown>, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      )
      .on('click', (_, d) => setSelectedNode(d));

    const label = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .attr("font-size", 14)
      .attr("text-anchor", "middle")
      .attr("dy", 40)
      .text(d => d.label);

    svg.call(
      d3.zoom<any, any>().on('zoom', (event) => {
        svg.selectAll('g').attr('transform', event.transform.toString());
      })
    );

    simulation.on("tick", () => {
      link
      .attr("x1", d => (d.source as any).x)
      .attr("y1", d => (d.source as any).y)
      .attr("x2", d => (d.target as any).x)
      .attr("y2", d => (d.target as any).y);
      node
        .attr("cx", d => d.x!)
        .attr("cy", d => d.y!);
      label
        .attr("x", d => d.x!)
        .attr("y", d => d.y!);
    });
  }, [filterType, filterLevel, filterModel]);

  const handleExportSVG = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mandala-network.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center">
      <label className="mb-2">
        Filter nach Typ:
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="ml-2 border p-1 rounded"
        >
          <option value="all">Alle</option>
          {types.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </label>
      <label className="mb-2">
        CREP-Level:
        <select
          value={filterLevel}
          onChange={e => setFilterLevel(e.target.value)}
          className="ml-2 border p-1 rounded"
        >
          <option value="all">Alle</option>
          <option value="low">Niedrig</option>
          <option value="medium">Mittel</option>
          <option value="high">Hoch</option>
        </select>
      </label>
      <label className="mb-2">
        Model:
        <select
          value={filterModel}
          onChange={e => setFilterModel(e.target.value)}
          className="ml-2 border p-1 rounded"
        >
          <option value="all">Alle</option>
          {models.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </label>
      <svg ref={svgRef} width={800} height={600} tabIndex={0} aria-label="Mandala Netzwerk" />
      <button onClick={handleExportSVG} className="mt-4 p-2 bg-blue-600 text-white rounded-lg shadow">
        Export as SVG
      </button>
      {selectedNode ? (
        <div data-testid="node-details" className="mt-4 p-2 border rounded text-center">
          <div className="font-bold">{selectedNode.label}</div>
          <div>
            C:{selectedNode.crep.C} R:{selectedNode.crep.R} E:{selectedNode.crep.E} P:{selectedNode.crep.P}
          </div>
          {selectedNode.poetry && <div className="italic">{selectedNode.poetry}</div>}
        </div>
      ) : (
        <div data-testid="node-details" className="mt-4 text-sm text-gray-600">No node selected</div>
      )}
      <Tooltip id="node-tooltip" data-testid="tooltip-anchor" />
    </div>
  );
};

export default MandalaNetworkView;
