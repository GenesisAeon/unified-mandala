import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

// Annahme: sigillin_nodes.json ist bereits im Projekt und importierbar
import nodesData from "../data/sigillin_nodes.json";

interface MandalaNode {
  id: string;
  label: string;
  crep: { C: number; R: number; E: number; P: number };
  related: Array<{ id: string; relation: string }>;
  type: string;
  status: string;
  poetry?: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

const colorForCREP = ({ C, R, E, P }: MandalaNode["crep"]) =>
  d3.interpolateRainbow((C + R + E + P) / 40);

export const MandalaNetworkView: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // D3-Force-Simulation
    const width = 800, height = 600;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const nodes: MandalaNode[] = nodesData;
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
      .call(d3.drag<SVGCircleElement, MandalaNode>()
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
        }));

    node.append("title")
      .text(d => `${d.label}\n${d.poetry || ""}`);

    const label = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .attr("font-size", 14)
      .attr("text-anchor", "middle")
      .attr("dy", 40)
      .text(d => d.label);

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
  }, []);

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
      <svg ref={svgRef} width={800} height={600} tabIndex={0} aria-label="Mandala Netzwerk" />
      <button onClick={handleExportSVG} className="mt-4 p-2 bg-blue-600 text-white rounded-lg shadow">
        Export as SVG
      </button>
    </div>
  );
};

export default MandalaNetworkView;
