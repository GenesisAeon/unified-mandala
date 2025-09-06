import fs from "node:fs";
import path from "node:path";

type Node = { id: string; type?: string; };
type Edge = { from: string; to: string; note?: string; };
type Flow = { id: string; title?: string; edges: Edge[]; };
type ProgramFlow = { version: number; flows: Flow[]; nodes: Node[]; };

export function toMermaid(pf: ProgramFlow): string {
  const header = "flowchart LR";
  const nodeDecls = pf.nodes.map(n => {
    const label = n.id;
    const shape = n.type === "actor" ? "((" + label + "))"
      : n.type === "service" ? "[" + label + "]"
      : n.type === "app" ? "{{" + label + "}}"
      : "(" + label + ")";
    return `${n.id}${shape}`;
  }).join("\n");

  const edgeDecls = pf.flows.flatMap(f =>
    f.edges.map(e => `${e.from} -->${e.note ? `|${e.note}|` : ""} ${e.to}`)
  ).join("\n");

  return [header, nodeDecls, edgeDecls].join("\n");
}

export function writeMermaidFile(pf: ProgramFlow, outDir: string) {
  const mmd = toMermaid(pf);
  const mmdPath = path.join(outDir, "program-flow.mmd");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(mmdPath, mmd, "utf8");
  return mmdPath;
}
