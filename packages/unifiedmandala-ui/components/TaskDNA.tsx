import React from 'react';

export interface TaskDNAProps {
  tasks: string[];
}

const TaskDNA: React.FC<TaskDNAProps> = ({ tasks }) => (
  <div className="task-dna">
    {tasks.map((task, i) => (
      <span key={i} className="dna-segment" data-index={i}>
        {task}
      </span>
    ))}
  </div>
);

export default TaskDNA;
