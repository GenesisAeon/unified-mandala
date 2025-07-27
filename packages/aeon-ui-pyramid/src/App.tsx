import React from 'react';
import { Canvas } from '@react-three/fiber';

export const PyramidApp: React.FC = () => {
  return (
    <Canvas>
      <mesh>
        <coneGeometry args={[1, 1.5, 4]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </Canvas>
  );
};

export default PyramidApp;
