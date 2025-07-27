import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import * as Tone from 'tone';

const CosmicPlayground: React.FC = () => {
  const started = useRef(false);
  useEffect(() => {
    if (!started.current) {
      const synth = new Tone.Synth().toDestination();
      synth.triggerAttackRelease('C4', '8n');
      started.current = true;
    }
  }, []);

  return (
    <Canvas style={{ height: '200px' }}>
      <ambientLight />
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </Canvas>
  );
};

export default CosmicPlayground;
