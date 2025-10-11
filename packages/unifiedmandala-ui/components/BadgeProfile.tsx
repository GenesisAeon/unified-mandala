import React from 'react';

export interface BadgeProfileProps {
  /** Title of the badge */
  title: string;
  /** Current level of the badge */
  level: number;
  /** Optional icon or emoji to display next to the badge */
  icon?: string;
}

/**
 * BadgeProfile displays a simple gamification badge with a title,
 * optional icon and level indicator.
 */
const BadgeProfile: React.FC<BadgeProfileProps> = ({ title, level, icon }) => {
  return (
    <div data-testid="badge-profile" className="badge-profile">
      {icon && (
        <span aria-hidden="true" className="badge-icon">
          {icon}
        </span>
      )}
      <span className="badge-title">{title}</span>
      <span className="badge-level">Level {level}</span>
    </div>
  );
};

export default BadgeProfile;
