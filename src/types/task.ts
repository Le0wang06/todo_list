export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'inProgress' | 'completed';
  priority: number;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
} 