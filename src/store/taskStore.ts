import { create } from 'zustand';
import { Task } from '../types';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  addTask: (task: Omit<Task, 'task_id' | 'created_at'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  getUserTasks: (userId: string, isAdmin: boolean) => Promise<void>;
  filterTasks: (status: string, search: string) => Task[];
  fetchTasks: () => Promise<void>;
  clearError: () => void;
}

const API_BASE_URL = 'https://y97kbmz70d.execute-api.eu-west-1.amazonaws.com/dev';

// API functions
const api = {
  fetchTasks: async (): Promise<Task[]> => {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    if (!response.ok) {
      throw new Error(`Failed to fetch tasks: ${response.statusText}`);
    }
    const data = await response.json();
    return data.tasks;
  },

  fetchUserTasks: async (userId: string): Promise<Task[]> => {
    const response = await fetch(`${API_BASE_URL}/tasks/user/${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user tasks: ${response.statusText}`);
    }
    const data = await response.json();
    return data.tasks;
  },

  createTask: async (task: Omit<Task, 'task_id' | 'created_at'>): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error(`Failed to create task: ${response.statusText}`);
    }
    return response.json();
  },

  updateTask: async (id: string, updates: Partial<Task>): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error(`Failed to update task: ${response.statusText}`);
    }
    return response.json();
  },

  deleteTask: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete task: ${response.statusText}`);
    }
  },
};

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  addTask: async (task) => {
    try {
      set({ isLoading: true, error: null });
      const newTask = await api.createTask(task);
      set((state) => ({
        tasks: [...state.tasks, newTask.task],
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add task',
        isLoading: false 
      });
    }
  },

  updateTask: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      const updatedTask = await api.updateTask(id, updates);
      console.log(updatedTask.task);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.task_id === id ? updatedTask.task : task
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update task',
        isLoading: false 
      });
    }
  },

  deleteTask: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await api.deleteTask(id);
      set((state) => ({
        tasks: state.tasks.filter((task) => task.task_id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete task',
        isLoading: false 
      });
    }
  },

  filterTasks: (status, search) => {
    const state = get();
    return state.tasks.filter((task) => {
      const matchesStatus = status === 'all' || task.status === status;
      const searchLower = search.toLowerCase();
      const matchesSearch = search === '' ||
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower);
      return matchesStatus && matchesSearch;
    });
  },

  getUserTasks: async (userId, isAdmin) => {
    try {
      set({ isLoading: true, error: null });
      const tasks = isAdmin
        ? await api.fetchTasks()
        : await api.fetchUserTasks(userId);
      set({ tasks, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch tasks',
        isLoading: false 
      });
    }
  },

  fetchTasks: async () => {
    try {
      set({ isLoading: true, error: null });
      const tasks = await api.fetchTasks();
      set({ tasks, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch tasks',
        isLoading: false 
      });
    }
  },

  clearError: () => set({ error: null }),
}));