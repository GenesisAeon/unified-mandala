import React from 'react';
import type { Q4State } from './GrayGrid';
import styles from './GridCell.module.css';

interface GridCellProps {
  state: Q4State;
  isActive: boolean;
  onClick?: () => void;
}

export default function GridCell({ state, isActive, onClick }: GridCellProps) {
  const { id, binary, C, R, E, P } = state;
  return (
    <button
      role="gridcell"
      aria-label={`Q4 Zustand ${id}: ${binary} (C=${C} R=${R} E=${E} P=${P})`}
      aria-pressed={isActive}
      className={`${styles.cell} ${isActive ? styles.active : ''}`}
      onClick={onClick}
    >
      <span className={styles.id}>{id}</span>
      <span className={styles.binary}>{binary}</span>
      <span className={styles.flags}>
        <span className={C ? styles.flagOn : styles.flagOff}>C</span>
        <span className={R ? styles.flagOn : styles.flagOff}>R</span>
        <span className={E ? styles.flagOn : styles.flagOff}>E</span>
        <span className={P ? styles.flagOn : styles.flagOff}>P</span>
      </span>
    </button>
  );
}
