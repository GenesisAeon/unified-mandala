import React from 'react';
import NestedPyramid from './NestedPyramid';
import { generateNestedLayers } from '../pyramid/generateNestedLayers';

export interface PyramidBlueprintProps {
  levels?: number;
}

const PyramidBlueprint: React.FC<PyramidBlueprintProps> = ({ levels = 2 }) => {
  const root = generateNestedLayers(levels);
  return <NestedPyramid root={root} />;
};

export default PyramidBlueprint;
