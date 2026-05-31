import React, { useState, useCallback } from 'react';
import GrayGrid, { stateFromId } from '../../components/GrayGrid';
import type { Q4State } from '../../components/GrayGrid';
import HypercubeView from '../../components/HypercubeView';
import CREPOverlay from '../../components/CREPOverlay';
import type { CREPValues } from '../../components/CREPOverlay';
import StreamMonitor, { useFrameStream } from '../../components/NATSMonitor/StreamMonitor';
import FrameHistory from '../../components/NATSMonitor/FrameHistory';

const DEMO_CREP: CREPValues = { C: 0.82, R: 0.44, E: 0.91, P: 0.87, Gamma: 0.736 };

interface Q4DashboardPanelProps {
  natsUrl?: string;
  initialStateId?: number;
}

export default function Q4DashboardPanel({ natsUrl, initialStateId = 0 }: Q4DashboardPanelProps) {
  const [currentStateId, setCurrentStateId] = useState(initialStateId);
  const [previousStateId, setPreviousStateId] = useState<number | undefined>(undefined);

  const handleStateChange = useCallback((state: Q4State) => {
    setCurrentStateId((prev) => {
      setPreviousStateId(prev);
      return state.id;
    });
  }, []);

  const handleGridClick = useCallback((id: number) => {
    setCurrentStateId((prev) => {
      setPreviousStateId(prev);
      return id;
    });
  }, []);

  const { events } = useFrameStream(natsUrl, handleStateChange);
  const currentState = stateFromId(currentStateId);

  return (
    <div
      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.6rem', padding: '1.6rem' }}
    >
      {/* Linke Spalte: GrayGrid + CREP */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
        <section aria-label="Q4 Gray-Grid">
          <h2 style={{ fontSize: '0.875rem', color: '#94a3b8', margin: '0 0 0.5rem 0' }}>
            Q4 Gray-Grid — 16 Zustände (4 Bit)
          </h2>
          <GrayGrid currentStateId={currentStateId} onStateClick={handleGridClick} />
          <p style={{ fontSize: '0.65rem', color: '#475569', margin: '0.4rem 0 0 0' }}>
            Aktiv: ID {currentStateId} · {currentState.binary} · C={currentState.C} R=
            {currentState.R} E={currentState.E} P={currentState.P}
          </p>
        </section>

        <section aria-label="CREP Metriken">
          <h2 style={{ fontSize: '0.875rem', color: '#94a3b8', margin: '0 0 0.5rem 0' }}>
            CREP Float-Metriken
          </h2>
          <CREPOverlay values={DEMO_CREP} />
        </section>
      </div>

      {/* Rechte Spalte: Tesserakt + NATS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
        <section aria-label="Tesserakt-Projektion">
          <h2 style={{ fontSize: '0.875rem', color: '#94a3b8', margin: '0 0 0.5rem 0' }}>
            Tesserakt (4D-Hyperwürfel · 16 Ecken · 32 Kanten)
          </h2>
          <HypercubeView
            currentStateId={currentStateId}
            previousStateId={previousStateId}
            width={280}
            height={280}
          />
        </section>

        <section aria-label="NATS Stream Monitor">
          <h2 style={{ fontSize: '0.875rem', color: '#94a3b8', margin: '0 0 0.5rem 0' }}>
            ga.frame.* Live-Stream
          </h2>
          <StreamMonitor natsUrl={natsUrl} onStateChange={handleStateChange} />
          <div style={{ marginTop: '0.8rem' }}>
            <FrameHistory events={events} />
          </div>
        </section>
      </div>
    </div>
  );
}
