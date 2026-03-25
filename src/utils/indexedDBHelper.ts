import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import type { Expense } from '../types/expense';

// Database schema
interface SpesaCasaDB extends DBSchema {
  expenses: {
    key: string; // expense.id
    value: Expense;
  };
  pendingOps: {
    key: string; // operation.id
    value: PendingOperation;
  };
}

export interface PendingOperation {
  id: string;
  type: 'add' | 'delete' | 'update';
  data: any;
  timestamp: number;
  retries: number;
}

const DB_NAME = 'spesa-casa-db';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<SpesaCasaDB> | null = null;

/**
 * Initialize and get database instance
 */
export async function getDB(): Promise<IDBPDatabase<SpesaCasaDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<SpesaCasaDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create expenses store
      if (!db.objectStoreNames.contains('expenses')) {
        db.createObjectStore('expenses', { keyPath: 'id' });
      }

      // Create pending operations store
      if (!db.objectStoreNames.contains('pendingOps')) {
        db.createObjectStore('pendingOps', { keyPath: 'id' });
      }
    },
  });

  return dbInstance;
}

/**
 * Cache expenses locally
 */
export async function cacheExpenses(expenses: Expense[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('expenses', 'readwrite');

  // Clear existing expenses
  await tx.store.clear();

  // Add all expenses
  for (const expense of expenses) {
    await tx.store.put(expense);
  }

  await tx.done;
}

/**
 * Get cached expenses
 */
export async function getCachedExpenses(): Promise<Expense[]> {
  const db = await getDB();
  return db.getAll('expenses');
}

/**
 * Add pending operation
 */
export async function addPendingOperation(op: PendingOperation): Promise<void> {
  const db = await getDB();
  await db.put('pendingOps', op);
}

/**
 * Get all pending operations
 */
export async function getPendingOperations(): Promise<PendingOperation[]> {
  const db = await getDB();
  return db.getAll('pendingOps');
}

/**
 * Remove pending operation
 */
export async function removePendingOperation(opId: string): Promise<void> {
  const db = await getDB();
  await db.delete('pendingOps', opId);
}

/**
 * Clear all pending operations
 */
export async function clearPendingOperations(): Promise<void> {
  const db = await getDB();
  await db.clear('pendingOps');
}
