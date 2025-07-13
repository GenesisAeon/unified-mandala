import React from 'react';
import { Canvas } from '@react-three/fiber';

const NestedCanvas: React.FC = () => (
  <Canvas data-testid="canvas">
    <group>
      <mesh>
        <boxGeometry args={[1,1,1]} />
        <meshStandardMaterial color="skyblue" />
      </mesh>
    </group>
  </Canvas>
);

export default NestedCanvas;
