import React from 'react';
import { Canvas } from '@react-three/fiber';
import { LayerNode } from '../pyramid/generateNestedLayers';

const renderLayer = (node: LayerNode, level = 0): JSX.Element => {
  const height = 1;
  const size = (level + 1) * node.weight * 2;
  return (
    <mesh key={level} position={[0, level * height, 0]} aria-label={`nested-layer-${level}`}>\n      <coneGeometry args={[size, height]} />\n      <meshStandardMaterial color="orange" />\n      {node.children && renderLayer(node.children, level + 1)}\n    </mesh>
  );
};

const NestedPyramid: React.FC<{ root: LayerNode }> = ({ root }) => (
  <Canvas>
    <ambientLight intensity={0.5} />
    <pointLight position={[10, 10, 10]} />
    {renderLayer(root)}
  </Canvas>
);

export default NestedPyramid;
