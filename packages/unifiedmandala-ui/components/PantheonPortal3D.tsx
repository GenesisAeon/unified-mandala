import React from 'react';
import { Canvas } from '@react-three/fiber';

export interface PantheonPortal3DProps {
  modules: string[];
}

const PantheonPortal3D: React.FC<PantheonPortal3DProps> = ({ modules }) => (
  <Canvas aria-label="pantheon-portal-3d">
    <ambientLight intensity={0.5} />
    <pointLight position={[10, 10, 10]} />
    {modules.map((m, i) => (
      <mesh key={m} position={[i * 2, 0, 0]} aria-label={`module-${m}`}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    ))}
  </Canvas>
);

export default PantheonPortal3D;
