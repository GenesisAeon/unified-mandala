import React from 'react';
import { Canvas } from '@react-three/fiber';

export default function PantheonBegegnungsraum() {
  return (
    <Canvas
      onCreated={({ gl }) => {
        if ((gl as any).xr) {
          (gl as any).xr.enabled = true;
        }
      }}
    >
      <ambientLight intensity={0.5} />
      <mesh position={[0, 1, -1]} aria-label="pantheon-begegnungsraum">
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial color="skyblue" />
      </mesh>
    </Canvas>
  );
}
