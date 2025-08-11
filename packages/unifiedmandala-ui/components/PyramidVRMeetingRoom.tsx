import React from 'react';
import { Canvas } from '@react-three/fiber';

interface ServiceAvatar {
  id: string;
  position: [number, number, number];
  color: string;
  onSelect: () => void;
}

const serviceAvatars: ServiceAvatar[] = [
  {
    id: 'local',
    position: [0, 0, -2],
    color: 'hotpink',
    onSelect: () => console.log('local service selected'),
  },
  {
    id: 'external',
    position: [1, 0, -2],
    color: 'cyan',
    onSelect: () => console.log('external service selected'),
  },
];

const Avatar: React.FC<ServiceAvatar> = ({ id, position, color, onSelect }) => (
  <mesh position={position} onClick={onSelect} aria-label={`avatar-${id}`}>
    <sphereGeometry args={[0.3, 16, 16]} />
    <meshStandardMaterial color={color} />
  </mesh>
);

const PyramidVRMeetingRoom: React.FC = () => (
  <Canvas onCreated={({ gl }) => { if ((gl as any).xr) { (gl as any).xr.enabled = true; } }}>
    <ambientLight intensity={0.5} />
    {serviceAvatars.map((avatar) => (
      <Avatar key={avatar.id} {...avatar} />
    ))}
  </Canvas>
);

export default PyramidVRMeetingRoom;
