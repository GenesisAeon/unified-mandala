import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function PantheonPortal3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderer = new THREE.WebGLRenderer();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    renderer.setSize(200, 200);
    if (containerRef.current) {
      containerRef.current.appendChild(renderer.domElement);
    }
    camera.position.z = 2;
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );
    scene.add(cube);
    renderer.render(scene, camera);
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return <div ref={containerRef} data-testid="pantheon-portal-3d" />;
}
