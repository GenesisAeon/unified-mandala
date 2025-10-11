import React, { useState } from 'react';
import YAML from 'yaml';

export interface TaskDef {
  plugin: string;
  input: any;
}

export const YAMLTaskGenerator: React.FC = () => {
  const [tasks, setTasks] = useState<TaskDef[]>([]);

  const addTask = () => setTasks([...tasks, { plugin: '', input: '' }]);

  const updateTask = (i: number, field: keyof TaskDef, value: string) => {
    const copy = [...tasks];
    (copy[i] as any)[field] = value;
    setTasks(copy);
  };

  const yaml = YAML.stringify(tasks);

  return (
    <div>
      {tasks.map((t, i) => (
        <div key={i}>
          <input
            placeholder="plugin"
            value={t.plugin}
            onChange={(e) => updateTask(i, 'plugin', e.target.value)}
          />
          <input
            placeholder="input"
            value={t.input}
            onChange={(e) => updateTask(i, 'input', e.target.value)}
          />
        </div>
      ))}
      <button onClick={addTask}>Add Task</button>
      <pre>{yaml}</pre>
    </div>
  );
};

export default YAMLTaskGenerator;
