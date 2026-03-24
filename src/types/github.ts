// GitHub API response types

export interface GitHubUserResponse {
  login: string;
  email: string | null;
  avatar_url: string;
  name: string | null;
}

export interface GitHubFileResponse {
  content: string; // Base64 encoded
  sha: string;
  size: number;
  name: string;
  path: string;
}

export interface GitHubCreateFileResponse {
  content: {
    sha: string;
    name: string;
    path: string;
  };
  commit: {
    sha: string;
    message: string;
  };
}
