import React from 'react';
import { Canvas } from '@react-three/fiber';

export default function FrequencyMandala3D() {
  return (
    <Canvas>
      <mesh>
        <circleGeometry args={[1, 32]} />
        <meshBasicMaterial color="hotpink" />
      </mesh>
    </Canvas>
  );
}
