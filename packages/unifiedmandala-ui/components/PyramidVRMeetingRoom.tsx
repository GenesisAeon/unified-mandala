import React from 'react';
import { Canvas } from '@react-three/fiber';

interface ServiceAvatar {
  id: string;
  position: [number, number, number];
  color: string;
  onSelect?: (id: string) => void;
}

const Avatar: React.FC<{
  position: [number, number, number];
  color: string;
  onSelect?: () => void;
}> = ({ position, color, onSelect }) => (
  <mesh position={position} aria-label="avatar" onClick={onSelect}>
    <sphereGeometry args={[0.3, 16, 16]} />
    <meshStandardMaterial color={color} />
  </mesh>
);

interface Props {
  services?: ServiceAvatar[];
}

const PyramidVRMeetingRoom: React.FC<Props> = ({ services = [] }) => (
  <Canvas
    onCreated={({ gl }) => {
      if ((gl as any).xr) {
        (gl as any).xr.enabled = true;
      }
    }}
  >
    <ambientLight intensity={0.5} />
    {services.map((svc) => (
      <Avatar
        key={svc.id}
        position={svc.position}
        color={svc.color}
        onSelect={() => svc.onSelect?.(svc.id)}
      />
    ))}
  </Canvas>
);

export default PyramidVRMeetingRoom;
