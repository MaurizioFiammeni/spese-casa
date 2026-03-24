import { useEffect, useState, useCallback, useRef } from 'react';
import { GitHubStorage } from '../services/githubStorage';
import { useAuthStore } from '../store/authStore';

export function useGitHubStorage() {
  const { githubToken, githubUser } = useAuthStore();
  const [storage, setStorage] = useState<GitHubStorage | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initializationAttempted = useRef(false);

  // Create storage instance when token and user are available
  useEffect(() => {
    if (githubToken && githubUser) {
      const storageInstance = new GitHubStorage(githubToken, githubUser.username);
      setStorage(storageInstance);
    } else {
      setStorage(null);
      setIsInitialized(false);
    }
  }, [githubToken, githubUser]);

  // Initialize repository
  const initialize = useCallback(async () => {
    if (!storage || isInitialized || isInitializing || initializationAttempted.current) {
      return;
    }

    setIsInitializing(true);
    setError(null);
    initializationAttempted.current = true;

    try {
      await storage.initializeRepo();
      setIsInitialized(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore durante l\'inizializzazione del repository';
      setError(errorMessage);
      console.error('Failed to initialize repository:', err);
      // Reset attempt flag on error to allow retry
      initializationAttempted.current = false;
    } finally {
      setIsInitializing(false);
    }
  }, [storage, isInitialized, isInitializing]);

  // Auto-initialize on mount
  useEffect(() => {
    if (storage && !isInitialized && !isInitializing) {
      initialize();
    }
  }, [storage, isInitialized, isInitializing, initialize]);

  return {
    storage,
    isInitialized,
    isInitializing,
    error,
    initialize,
  };
}
