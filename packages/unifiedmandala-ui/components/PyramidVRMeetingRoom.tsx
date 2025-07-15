import React from 'react';
import { Canvas } from '@react-three/fiber';

const Avatar: React.FC<{ position: [number, number, number]; color: string }> = ({ position, color }) => (
  <mesh position={position} aria-label="avatar">
    <sphereGeometry args={[0.3, 16, 16]} />
    <meshStandardMaterial color={color} />
  </mesh>
);

const PyramidVRMeetingRoom: React.FC = () => (
  <Canvas onCreated={({ gl }) => { if ((gl as any).xr) { (gl as any).xr.enabled = true; } }}>
    <ambientLight intensity={0.5} />
    <Avatar position={[0, 0, -2]} color="hotpink" />
    <Avatar position={[1, 0, -2]} color="cyan" />
  </Canvas>
);

export default PyramidVRMeetingRoom;
