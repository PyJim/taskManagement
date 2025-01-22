import { create } from 'zustand';
import { User } from '../types';
import Cookies from 'js-cookie';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<string>;
  signup: (email: string, password: string, firstname: string, isAdmin: boolean) => Promise<string>;
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
      // console.log(user);
      // console.log(idToken);

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
      return response;
    } catch (error: any) {
      // console.error('Login error:', error);
      return error.message;
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

      return response;
    } catch (error: any) {
      // console.error('Signup error:', error);
      return error.message;
    }
  },

  logout: () => {
    // Remove the token from cookies and reset user state
    Cookies.remove('accessToken');
    Cookies.remove('user');
    set({ user: null });
  },
}));
