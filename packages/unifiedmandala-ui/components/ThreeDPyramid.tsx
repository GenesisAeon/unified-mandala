import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';

interface ThreeDPyramidProps {
  layers: number;
}

const Layer: React.FC<{ index: number }> = ({ index }) => {
  const ref = useRef<Mesh>(null!);
  const height = 1;
  const size = (index + 1) * 2;

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.01 * (index + 1);
    }
  });

  return (
    <mesh ref={ref} position={[0, index * height, 0]} aria-label={`pyramid-layer-${index}`}> 
      <coneGeometry args={[size, height]} />
      <meshStandardMaterial color="teal" />
    </mesh>
  );
};

const ThreeDPyramid: React.FC<ThreeDPyramidProps> = ({ layers }) => (
  <Canvas>
    <ambientLight intensity={0.5} />
    <pointLight position={[10, 10, 10]} />
    {Array.from({ length: layers }).map((_, i) => (
      <Layer key={i} index={i} />
    ))}
  </Canvas>
);

export default ThreeDPyramid;
