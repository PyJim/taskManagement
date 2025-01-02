import { create } from 'zustand';
import { User } from '../types';

interface UserState {
  users: User[];
  getUsers: () => User[];
}

// Sample users data
const sampleUsers: User[] = [
  { username: '1', email: 'john@example.com', password: 'password', groups: ['Admins'], firstname: 'John'},
  { username: '2', email: 'jane@example.com', password: 'password', groups: ['Users'], firstname: 'Jane'},
  { username: '3', email: 'bob@example.com', password: 'password', groups: ['Users'], firstname: 'Bob'},
];

export const useUserStore = create<UserState>(() => ({
  users: sampleUsers,
  getUsers: () => sampleUsers.filter(user => !(user.groups.includes('Admins'))),
}));