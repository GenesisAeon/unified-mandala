import * as THREE from 'three';
import * as d3 from 'd3';
import YAML from 'yaml';
import fs from 'fs';
import path from 'path';

export interface MandalaNode {
  id: string;
  label: string;
  x?: number;
  y?: number;
  z?: number;
}
export interface MandalaEdge {
  source: string;
  target: string;
}

/**
 * Load the mastercanvas YAML and parse basic node structure.
 */
export function loadMasterCanvas(file = path.join(__dirname, '../../docs/mastercanvas.yaml')): { nodes: MandalaNode[]; edges: MandalaEdge[] } {
  const text = fs.readFileSync(file, 'utf8');
  const doc = YAML.parse(text);
  const nodes: MandalaNode[] = [];
  const edges: MandalaEdge[] = [];
  if (Array.isArray(doc.nodes)) {
    doc.nodes.forEach((n: any) => nodes.push({ id: String(n.id), label: n.label || String(n.id) }));
  }
  if (Array.isArray(doc.edges)) {
    doc.edges.forEach((e: any) => edges.push({ source: String(e.source), target: String(e.target) }));
  }
  return { nodes, edges };
}

/**
 * Very small Three.js scene setup that displays spheres for nodes.
 */
export function createMandalaGraphScene(data: { nodes: MandalaNode[]; edges: MandalaEdge[] }): THREE.Scene {
  const scene = new THREE.Scene();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ffcc });
  data.nodes.forEach((n, i) => {
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5), material);
    sphere.position.set(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5);
    scene.add(sphere);
  });
  return scene;
}
