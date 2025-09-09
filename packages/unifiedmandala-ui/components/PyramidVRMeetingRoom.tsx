import React from "react";
import { Canvas } from "@react-three/fiber";

const Box = (props: any) => (
  <mesh {...props}>
    <boxGeometry args={[0.3, 0.3, 0.3]} />
    <meshStandardMaterial />
  </mesh>
);

export default function PyramidVRMeetingRoom() {
  return (
    <div style={{ height: 400, background: "#111" }}>
      <Canvas onCreated={({ gl }) => { if ((gl as any).xr) (gl as any).xr.enabled = true; }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box position={[0, 0, -2]} />
      </Canvas>
    </div>
  );
}
