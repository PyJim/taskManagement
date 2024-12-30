import { create } from 'zustand';
import { User } from '../types';

interface UserState {
  users: User[];
  getUsers: () => User[];
}

// Sample users data
const sampleUsers: User[] = [
  { user_id: '1', email: 'john@example.com', password: 'password', role: 'admin', firstname: 'John'},
  { user_id: '2', email: 'jane@example.com', password: 'password', role: 'member', firstname: 'Jane'},
  { user_id: '3', email: 'bob@example.com', password: 'password', role: 'member', firstname: 'Bob'},
];

export const useUserStore = create<UserState>(() => ({
  users: sampleUsers,
  getUsers: () => sampleUsers.filter(user => !(user.role=='admin')),
}));