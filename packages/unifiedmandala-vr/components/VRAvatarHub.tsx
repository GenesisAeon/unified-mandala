import React, { useState } from 'react';

const VRAvatarHub: React.FC = () => {
  const [avatars, setAvatars] = useState<string[]>([]);

  const spawnAvatar = (id: string) => {
    setAvatars(prev => [...prev, id]);
  };

  return (
    <div>
      <button onClick={() => spawnAvatar(`avatar-${avatars.length}`)} aria-label="spawn-avatar">
        Spawn Avatar
      </button>
      <ul>
        {avatars.map(a => (
          <li key={a}>{a}</li>
        ))}
      </ul>
    </div>
  );
};

export default VRAvatarHub;
