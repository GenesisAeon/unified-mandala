import React, { useEffect } from 'react';

export interface ResonanceActionPromptProps {
  crep: { C: number; R: number; E: number; P: number };
  onAction?: (suggestion: string) => void;
}

export function ResonanceActionPrompt({ crep, onAction }: ResonanceActionPromptProps) {
  let suggestion = '';
  if (crep.R < 30) suggestion = 'Bitte eine kurze Pause einlegen';
  else if (crep.E > 70) suggestion = 'Dokumentation aktualisieren';

  useEffect(() => {
    if (suggestion && onAction) onAction(suggestion);
  }, [suggestion, onAction]);

  return <div data-testid="resonance-action">{suggestion}</div>;
}
