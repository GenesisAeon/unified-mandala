import React, { useState } from 'react';

export interface VRAvatarHubProps {
  initialAvatars?: string[];
}

export default function VRAvatarHub({ initialAvatars = [] }: VRAvatarHubProps) {
  const [avatars, setAvatars] = useState(initialAvatars);
  const addAvatar = (id: string) => setAvatars((a) => [...a, id]);
  return (
    <div>
      <ul>
        {avatars.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>
      <button onClick={() => addAvatar('new')}>add</button>
    </div>
  );
}
