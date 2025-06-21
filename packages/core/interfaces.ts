export interface Task {
  id: string;
  description: string;
  crep?: { C: number; R: number; E: number; P: number };
  [key: string]: any;
}

export interface Agent {
  id: string;
  layer: string;
  handle(task: Task): Promise<void> | void;
}
