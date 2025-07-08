import React from 'react';
import { Canvas } from '@react-three/fiber';

const ThreeFiberSkeleton: React.FC = () => (
  <Canvas>
    <ambientLight />
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  </Canvas>
);

export default ThreeFiberSkeleton;
