export interface User {
  user_id: string;
  email: string;
  password: string;
  role: 'admin' | 'member';
  firstname: string;
}

export interface Task {
  task_id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  assigned_to: string;
  created_at: string;
  deadline: string;
}