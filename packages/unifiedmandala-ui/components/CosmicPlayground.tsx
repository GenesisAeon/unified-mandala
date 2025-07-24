import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as Tone from 'tone';

const OscSphere: React.FC = () => {
  useEffect(() => {
    const osc = new Tone.Oscillator().toDestination();
    osc.start();
    return () => {
      osc.stop();
      osc.dispose();
    };
  }, []);

  return (
    <mesh>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};

const CosmicPlayground: React.FC = () => (
  <Canvas>
    <ambientLight intensity={0.4} />
    <pointLight position={[2, 2, 2]} />
    <OscSphere />
  </Canvas>
);

export default CosmicPlayground;
