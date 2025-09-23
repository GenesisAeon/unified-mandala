#!/usr/bin/env node
import { connect, StringCodec } from 'nats';
import { describeServers, parseNatsServers, resolveCosmicSubject } from './_cosmic-rt.mjs';

const servers = parseNatsServers();
const subject = resolveCosmicSubject();

const encoder = StringCodec();

function perturb(graph) {
  if (!graph.nodes || graph.nodes.length < 3) return graph;
  const clone = {
    nodes: [...graph.nodes],
    edges: graph.edges.map((edge) => ({ ...edge })),
    labels: graph.labels ? { ...graph.labels } : undefined,
  };
  const idx = Math.floor(Math.random() * clone.nodes.length);
  const partner = (idx + 3) % clone.nodes.length;
  clone.edges.push({ source: clone.nodes[idx], target: clone.nodes[partner], weight: 1 });
  return clone;
}

function seedGraph() {
  const nodes = Array.from({ length: 24 }, (_, index) => `n${index}`);
  const labels = Object.fromEntries(nodes.map((node, index) => [node, index % 3]));
  const edges = nodes.map((node, index) => ({
    source: node,
    target: nodes[(index + 1) % nodes.length],
    weight: 1,
  }));
  return { nodes, edges, labels };
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  const connection = await connect({ servers });
  console.log(`[cosmic-publisher] streaming ${subject} via ${describeServers(servers)}`);
  let graph = seedGraph();
  for (;;) {
    graph = perturb(graph);
    const payload = JSON.stringify({
      type: 'cosmic.tick',
      graph,
      generatedAt: new Date().toISOString(),
    });
    await connection.publish(subject, encoder.encode(payload));
    await sleep(1500);
  }
})();
