import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, type UserProfile } from '../api/services/auth.service';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  roles: string[];
  subscriptionTier: string;
  createdAt: string;
  lastLoginAt?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isAdmin: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.login({ email, password });

          // Check if user has admin role
          const isAdmin = response.user.roles.includes('Admin');

          if (!isAdmin) {
            set({ isLoading: false, error: 'Access denied. Admin privileges required.' });
            throw new Error('Access denied. Admin privileges required.');
          }

          const user: AuthUser = {
            id: response.user.id,
            email: response.user.email,
            name: `${response.user.firstName} ${response.user.lastName}`,
            firstName: response.user.firstName,
            lastName: response.user.lastName,
            roles: response.user.roles,
            subscriptionTier: response.user.subscriptionTier,
            createdAt: response.user.createdAt,
          };

          set({
            user,
            token: response.token,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isAdmin: true,
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Login failed';
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isAdmin: false,
            error: null,
          });
        }
      },

      fetchUser: async () => {
        const { token } = get();
        if (!token) return;

        set({ isLoading: true });

        try {
          const profile: UserProfile = await authService.getMe();
          const isAdmin = profile.roles.includes('Admin');

          const user: AuthUser = {
            id: profile.id,
            email: profile.email,
            name: `${profile.firstName} ${profile.lastName}`,
            firstName: profile.firstName,
            lastName: profile.lastName,
            roles: profile.roles,
            subscriptionTier: profile.subscriptionTier,
            createdAt: profile.createdAt,
            lastLoginAt: profile.lastLoginAt,
          };

          set({
            user,
            isAuthenticated: true,
            isAdmin,
            isLoading: false,
          });
        } catch (error) {
          console.error('Failed to fetch user:', error);
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isAdmin: false,
            isLoading: false,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
    }
  )
);
