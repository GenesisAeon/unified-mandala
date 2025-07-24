import React, { useState } from 'react';

export interface VRAvatarHubProps {
  initial?: string[];
}

export function useAvatarHub(initial: string[] = []) {
  const [avatars, setAvatars] = useState(initial);
  const join = (name: string) => setAvatars(a => [...a, name]);
  const leave = (name: string) => setAvatars(a => a.filter(n => n !== name));
  return { avatars, join, leave };
}

const VRAvatarHub: React.FC<VRAvatarHubProps> = ({ initial = [] }) => {
  const { avatars, join, leave } = useAvatarHub(initial);
  return (
    <div>
      <ul aria-label="avatar-list">
        {avatars.map(a => <li key={a}>{a}</li>)}
      </ul>
      <button aria-label="join" onClick={() => join('avatar')}>Join</button>
      <button aria-label="leave" onClick={() => leave('avatar')}>Leave</button>
    </div>
  );
};

export default VRAvatarHub;
