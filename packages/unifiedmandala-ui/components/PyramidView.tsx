import React from 'react';
import { Canvas } from '@react-three/fiber';
import { PyramidConfig } from '../pyramid/PyramidConfig';

interface PyramidViewProps {
  config: PyramidConfig;
}

const Layer: React.FC<{ index: number; layer: { color?: string } }> = ({ index, layer }) => {
  const height = 1;
  const size = (index + 1) * 2;
  return (
    <mesh position={[0, index * height, 0]}>
      <coneGeometry args={[size, height]} />
      <meshStandardMaterial color={layer.color || 'orange'} />
    </mesh>
  );
};

const PyramidView: React.FC<PyramidViewProps & React.ComponentProps<typeof Canvas>> = ({ config, ...props }) => (
  <Canvas {...props}>
    <ambientLight intensity={0.5} />
    <pointLight position={[10, 10, 10]} />
    {config.layers.map((layer, i) => (
      <Layer key={i} index={i} layer={layer} />
    ))}
  </Canvas>
);

export default PyramidView;
