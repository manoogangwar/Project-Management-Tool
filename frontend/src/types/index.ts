export interface Project {
  id: number;
  title: string;
  description: string;
  status: "active" | "completed";
}

export interface Task {
  id: number;
  project: number;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  due_date: string;
}