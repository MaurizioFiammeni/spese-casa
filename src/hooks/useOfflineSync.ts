import { useState, useEffect, useCallback } from 'react';
import { offlineQueue } from '../services/offlineQueue';
import type { GitHubStorage } from '../services/githubStorage';
import { cacheExpenses, getCachedExpenses } from '../utils/indexedDBHelper';
import type { Expense } from '../types/expense';

export interface UseOfflineSyncReturn {
  isOnline: boolean;
  pendingCount: number;
  isSyncing: boolean;
  syncNow: () => Promise<void>;
  getCachedData: () => Promise<Expense[]>;
  cacheData: (expenses: Expense[]) => Promise<void>;
}

export function useOfflineSync(storage: GitHubStorage | null): UseOfflineSyncReturn {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  // Update pending count
  const updatePendingCount = useCallback(async () => {
    const count = await offlineQueue.getPendingCount();
    setPendingCount(count);
  }, []);

  // Sync pending operations
  const syncNow = useCallback(async () => {
    if (!storage || !isOnline || isSyncing) {
      return;
    }

    setIsSyncing(true);

    try {
      const result = await offlineQueue.processPendingOperations(storage);
      console.log(`Sync completed: ${result.successful} successful, ${result.failed} failed`);

      await updatePendingCount();

      if (result.successful > 0) {
        // Trigger a refresh of expenses
        return;
      }
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [storage, isOnline, isSyncing, updatePendingCount]);

  // Listen to online/offline events
  useEffect(() => {
    const handleOnline = () => {
      console.log('Back online - syncing...');
      setIsOnline(true);
    };

    const handleOffline = () => {
      console.log('Going offline');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && storage && pendingCount > 0) {
      syncNow();
    }
  }, [isOnline, storage, pendingCount, syncNow]);

  // Update pending count on mount and when online status changes
  useEffect(() => {
    updatePendingCount();
  }, [updatePendingCount]);

  // Cache management
  const getCachedData = useCallback(async () => {
    return getCachedExpenses();
  }, []);

  const cacheData = useCallback(async (expenses: Expense[]) => {
    await cacheExpenses(expenses);
  }, []);

  return {
    isOnline,
    pendingCount,
    isSyncing,
    syncNow,
    getCachedData,
    cacheData,
  };
}
