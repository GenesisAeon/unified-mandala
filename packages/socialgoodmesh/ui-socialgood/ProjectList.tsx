import React from 'react';

export interface Project {
  id: number;
  name: string;
}

export const ProjectList: React.FC<{ projects: Project[] }> = ({ projects }) => (
  <ul>
    {projects.map((p) => (
      <li key={p.id}>{p.name}</li>
    ))}
  </ul>
);
