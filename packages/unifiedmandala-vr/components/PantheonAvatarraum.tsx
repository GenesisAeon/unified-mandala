import React from 'react';
import { Canvas } from '@react-three/fiber';

export default function PantheonAvatarraum() {
  return (
    <Canvas
      onCreated={({ gl }) => {
        if ((gl as any).xr) {
          (gl as any).xr.enabled = true;
        }
      }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[2, 2, 2]} />
      <mesh position={[0, 1, -2]} aria-label="pantheon-avatarraum">
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </Canvas>
  );
}
