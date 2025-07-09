import React from 'react';
import { Canvas } from '@react-three/fiber';

const PyramidVRView: React.FC = () => (
  <Canvas frameloop="demand" onCreated={({ gl }) => { if ((gl as any).xr) { (gl as any).xr.enabled = true; } }}>
    <ambientLight intensity={0.5} />
    <mesh position={[0, 0, -2]} aria-label="vr-pyramid">
      <coneGeometry args={[1, 1.5]} />
      <meshStandardMaterial color="cyan" />
    </mesh>
  </Canvas>
);

export default PyramidVRView;
