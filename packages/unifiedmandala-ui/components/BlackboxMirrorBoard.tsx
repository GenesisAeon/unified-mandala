import React, { useState } from 'react';

export interface BlackboxMirrorBoardProps {
  /**
   * Placeholder text for the input field.
   */
  placeholder?: string;
}

/**
 * BlackboxMirrorBoard mirrors user input in real-time. The typed text is
 * reflected in reverse order to symbolize introspective reflection layers.
 */
export default function BlackboxMirrorBoard({ placeholder = 'Schreibe hier...' }: BlackboxMirrorBoardProps) {
  const [value, setValue] = useState('');
  const mirror = value.split('').reverse().join('');

  return (
    <div aria-label="blackbox-mirror-board">
      <textarea
        aria-label="blackbox-input"
        placeholder={placeholder}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <div aria-label="blackbox-mirror">{mirror}</div>
    </div>
  );
}
