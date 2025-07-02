import React from 'react';
import { Project } from './ProjectList';

export const ProjectDetail: React.FC<{ project: Project & { notes: string } }> = ({ project }) => (
  <article>
    <h3>{project.name}</h3>
    <p>{project.notes}</p>
  </article>
);
