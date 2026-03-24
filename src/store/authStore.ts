import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Octokit } from 'octokit';
import type { AuthState, GitHubUser } from '../types/auth';

const STORAGE_KEY = 'spese-casa-auth';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      githubToken: null,
      githubUser: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (githubToken: string) => {
        set({ isLoading: true, error: null });

        try {
          // Validate token by fetching user info
          const octokit = new Octokit({ auth: githubToken });
          const { data } = await octokit.rest.users.getAuthenticated();

          const user: GitHubUser = {
            username: data.login,
            email: data.email || '',
            avatarUrl: data.avatar_url,
          };

          set({
            githubToken,
            githubUser: user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Token GitHub non valido. Verifica il token e riprova.';

          set({
            githubToken: null,
            githubUser: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });

          throw new Error(errorMessage);
        }
      },

      logout: () => {
        set({
          githubToken: null,
          githubUser: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        githubToken: state.githubToken,
        githubUser: state.githubUser,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
