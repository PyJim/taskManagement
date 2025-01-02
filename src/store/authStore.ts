import { create } from 'zustand';
import { User } from '../types';
import Cookies from 'js-cookie';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, firstname: string, isAdmin: boolean) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: Cookies.get('user') ? JSON.parse(Cookies.get('user') as string) : null,
  accessToken: Cookies.get('accessToken') || null,

  login: async (email, password) => {
    try {
      const response = await fetch(
        'https://y97kbmz70d.execute-api.eu-west-1.amazonaws.com/dev/users/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        throw new Error('Invalid credentials or server error');
      }

      const { idToken, user } = await response.json();

      // Store the access token in cookies
      Cookies.set('accessToken', idToken, {
        expires: 7, // 7 days
        secure: true,
        sameSite: 'strict',
      });
    
      Cookies.set('user', JSON.stringify(user), {
        expires: 7, // 7 days
        secure: true,
        sameSite: 'strict',
      });
      // Update user state
      set({ user });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },

  signup: async (email, password, firstname, isAdmin) => {
    try {
      const response = await fetch(
        'https://y97kbmz70d.execute-api.eu-west-1.amazonaws.com/dev/users/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email:email, password:password, firstname:firstname, isAdmin:isAdmin }),
        }
      );

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  },

  logout: () => {
    // Remove the token from cookies and reset user state
    Cookies.remove('accessToken');
    Cookies.remove('user');
    set({ user: null });
  },
}));
