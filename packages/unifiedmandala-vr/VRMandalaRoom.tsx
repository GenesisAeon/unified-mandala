import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { connectFourierLayerBridge } from '../unifiedmandala-ui/events/FourierLayerBridge';

const VRMandalaRoom: React.FC = () => {
  useEffect(() => {
    const ws = connectFourierLayerBridge();
    return () => ws.close();
  }, []);

  return (
    <Canvas
      onCreated={({ gl }) => {
        if ((gl as any).xr) {
          (gl as any).xr.enabled = true;
        }
      }}
    >
      <ambientLight intensity={0.5} />
      <mesh position={[0, 0, -2]} aria-label="vr-mandala-room">
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="magenta" />
      </mesh>
    </Canvas>
  );
};

export default VRMandalaRoom;
