import { create } from 'zustand';
import type { Expense } from '../types/expense';
import type { GitHubStorage } from '../services/githubStorage';

interface ExpenseState {
  expenses: Expense[];
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
  lastSyncedAt: string | null;

  // Actions
  setExpenses: (expenses: Expense[]) => void;
  fetchExpenses: (storage: GitHubStorage) => Promise<void>;
  addExpense: (storage: GitHubStorage, expense: Omit<Expense, 'id' | 'createdAt' | 'createdBy' | 'updatedAt'>) => Promise<void>;
  deleteExpense: (storage: GitHubStorage, expenseId: string) => Promise<void>;
  updateExpense: (storage: GitHubStorage, expenseId: string, updates: Partial<Omit<Expense, 'id' | 'createdAt' | 'createdBy'>>) => Promise<void>;
  clearError: () => void;
}

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  expenses: [],
  isLoading: false,
  isSyncing: false,
  error: null,
  lastSyncedAt: null,

  setExpenses: (expenses) => set({ expenses }),

  fetchExpenses: async (storage) => {
    set({ isLoading: true, error: null });

    try {
      const { data } = await storage.getExpenses();

      // Sort by date descending (newest first)
      const sortedExpenses = data.expenses.sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      set({
        expenses: sortedExpenses,
        isLoading: false,
        lastSyncedAt: new Date().toISOString(),
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore durante il caricamento delle spese';
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  addExpense: async (storage, expenseData) => {
    set({ isSyncing: true, error: null });

    try {
      const newExpense = await storage.addExpense(expenseData);

      // Optimistic update: add to local state immediately
      const currentExpenses = get().expenses;
      const updatedExpenses = [newExpense, ...currentExpenses].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      set({
        expenses: updatedExpenses,
        isSyncing: false,
        lastSyncedAt: new Date().toISOString(),
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore durante l\'aggiunta della spesa';
      set({
        error: errorMessage,
        isSyncing: false,
      });
      throw error;
    }
  },

  deleteExpense: async (storage, expenseId) => {
    set({ isSyncing: true, error: null });

    // Store current state for rollback
    const currentExpenses = get().expenses;

    try {
      // Optimistic update: remove from local state immediately
      const updatedExpenses = currentExpenses.filter((e) => e.id !== expenseId);
      set({ expenses: updatedExpenses });

      // Perform actual delete
      await storage.deleteExpense(expenseId);

      set({
        isSyncing: false,
        lastSyncedAt: new Date().toISOString(),
      });
    } catch (error) {
      // Rollback on error
      set({ expenses: currentExpenses });

      const errorMessage = error instanceof Error ? error.message : 'Errore durante l\'eliminazione della spesa';
      set({
        error: errorMessage,
        isSyncing: false,
      });
      throw error;
    }
  },

  updateExpense: async (storage, expenseId, updates) => {
    set({ isSyncing: true, error: null });

    // Store current state for rollback
    const currentExpenses = get().expenses;

    try {
      // Optimistic update: update local state immediately
      const updatedExpenses = currentExpenses.map((e) =>
        e.id === expenseId
          ? { ...e, ...updates, updatedAt: new Date().toISOString() }
          : e
      ).sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      set({ expenses: updatedExpenses });

      // Perform actual update
      await storage.updateExpense(expenseId, updates);

      set({
        isSyncing: false,
        lastSyncedAt: new Date().toISOString(),
      });
    } catch (error) {
      // Rollback on error
      set({ expenses: currentExpenses });

      const errorMessage = error instanceof Error ? error.message : 'Errore durante l\'aggiornamento della spesa';
      set({
        error: errorMessage,
        isSyncing: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
