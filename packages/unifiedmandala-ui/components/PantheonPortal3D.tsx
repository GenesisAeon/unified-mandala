import React from 'react';
import { Canvas } from '@react-three/fiber';

export default function PantheonPortal3D() {
  return (
    <Canvas aria-label="pantheon-portal-3d">
      <ambientLight intensity={0.4} />
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </Canvas>
  );
}
