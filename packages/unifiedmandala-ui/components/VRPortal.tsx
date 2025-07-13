import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

const RotatingBox: React.FC = () => {
  const ref = useRef<any>();
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.01;
  });
  return (
    <mesh ref={ref} position={[0, 1, -3]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};

const VRPortal: React.FC = () => (
  <div>
    <Canvas>
      <ambientLight />
      <RotatingBox />
    </Canvas>
  </div>
);

export default VRPortal;
