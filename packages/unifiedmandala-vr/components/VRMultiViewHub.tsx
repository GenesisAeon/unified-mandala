import React from 'react';

export const VRMultiViewHub: React.FC<{ view: '2d' | '3d' | 'vr' }> = ({ view }) => {
  return <div>Current view: {view}</div>;
};
