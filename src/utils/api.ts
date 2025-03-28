const API_BASE_URL = '/api';

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    name: string;
  };
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface ResData<T> {
  code: number;
  msg: string;
  data: T;
}

export const login = async (credentials: LoginCredentials): Promise<ResData<LoginResponse>> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  return response.json();
};

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'inProgress' | 'completed';
  priority: number;
  dueDate: string;
}

export const getTasks = async (): Promise<ResData<Task[]>> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/api/tasks`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch tasks');
  }

  return response.json();
};

export const createTask = async (task: Omit<Task, 'id'>): Promise<ResData<Task>> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/api/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create task');
  }

  return response.json();
};

export const updateTask = async (id: string, task: Partial<Task>): Promise<ResData<Task>> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update task');
  }

  return response.json();
};

export const deleteTask = async (id: string): Promise<ResData<void>> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete task');
  }

  return response.json();
}; 