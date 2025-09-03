import React, { useEffect, useState } from 'react';

interface Task {
  id: string;
  title: string;
}

/**
 * TaskBoard lists tasks from the orchestrator API and allows enqueueing new ones.
 * This lightweight component demonstrates basic interaction without depending on
 * a specific backend implementation.
 */
export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    fetch('/api/tasks')
      .then((res) => res.json())
      .then((data) => setTasks(Array.isArray(data) ? data : []))
      .catch(() => setTasks([]));
  }, []);

  async function addTask() {
    if (!title.trim()) return;
    const newTask = { title };
    setTitle('');
    try {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      setTasks((prev) => [
        ...prev,
        { id: Math.random().toString(36).slice(2), title: newTask.title }
      ]);
    } catch {
      /* ignore network errors in demo */
    }
  }

  return (
    <div aria-label="TaskBoard">
      <h2>Task Board</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
      <input
        aria-label="new-task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New task"
      />
      <button onClick={addTask}>Add Task</button>
    </div>
  );
}
