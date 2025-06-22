import React from 'react';

interface ProjectListViewProps {
  projects?: string[];
}

const ProjectListView: React.FC<ProjectListViewProps> = ({ projects = [] }) => (
  <ul aria-label="Project List">
    {projects.map((p) => (
      <li key={p}>{p}</li>
    ))}
  </ul>
);

export default ProjectListView;
