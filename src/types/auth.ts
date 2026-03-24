export interface GitHubUser {
  username: string;
  email: string;
  avatarUrl?: string;
}

export interface AuthState {
  githubToken: string | null;
  githubUser: GitHubUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (githubToken: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}
