import React, { useEffect } from 'react';
import { VRBegegnungsraum } from './VRBegegnungsraum';
import { VRBoundaryConductor } from './VRBoundaryConductor';
import { PantheonBoundaryBridge } from '../pantheon/PantheonBoundaryBridge';

export interface VRExperienceRoomProps {
  url: string;
  rules?: (string | RegExp)[];
}

export default function VRExperienceRoom({ url, rules = [] }: VRExperienceRoomProps) {
  const vrRef = React.useRef<VRBegegnungsraum>();
  if (!vrRef.current) {
    vrRef.current = new VRBegegnungsraum();
  }
  const bridgeRef = React.useRef<PantheonBoundaryBridge>();
  if (!bridgeRef.current) {
    bridgeRef.current = new PantheonBoundaryBridge();
  }
  const conductorRef = React.useRef<VRBoundaryConductor>();
  if (!conductorRef.current) {
    conductorRef.current = new VRBoundaryConductor(vrRef.current, bridgeRef.current, rules);
  }

  useEffect(() => {
    const conductor = conductorRef.current!;
    conductor.start();
    vrRef.current!.join(url);
    return () => conductor.stop();
  }, [url, rules]);

  return <div aria-label="vr-experience-room">VR Experience Room</div>;
}
