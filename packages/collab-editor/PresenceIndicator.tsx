import React from 'react';

export interface PresenceUser {
  id: string;
  name: string;
  active?: boolean;
}

export interface PresenceIndicatorProps {
  users: PresenceUser[];
}

/**
 * Displays a list of users with a simple activity indicator.
 */
export function PresenceIndicator({ users }: PresenceIndicatorProps) {
  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>
          <span
            data-testid="indicator"
            style={{ color: u.active ? 'green' : 'gray', marginRight: 4 }}
          >
            ●
          </span>
          {u.name}
        </li>
      ))}
    </ul>
  );
}
