import type { Expense } from '../types/expense';
import type { GitHubStorage } from './githubStorage';
import {
  addPendingOperation,
  getPendingOperations,
  removePendingOperation,
  type PendingOperation,
} from '../utils/indexedDBHelper';

export class OfflineQueue {
  /**
   * Queue an add expense operation
   */
  async queueAddExpense(expenseData: Omit<Expense, 'id' | 'createdAt' | 'createdBy' | 'updatedAt'>): Promise<void> {
    const operation: PendingOperation = {
      id: crypto.randomUUID(),
      type: 'add',
      data: expenseData,
      timestamp: Date.now(),
      retries: 0,
    };

    await addPendingOperation(operation);
  }

  /**
   * Queue a delete expense operation
   */
  async queueDeleteExpense(expenseId: string): Promise<void> {
    const operation: PendingOperation = {
      id: crypto.randomUUID(),
      type: 'delete',
      data: { expenseId },
      timestamp: Date.now(),
      retries: 0,
    };

    await addPendingOperation(operation);
  }

  /**
   * Process all pending operations
   */
  async processPendingOperations(storage: GitHubStorage): Promise<{
    successful: number;
    failed: number;
  }> {
    const operations = await getPendingOperations();

    if (operations.length === 0) {
      return { successful: 0, failed: 0 };
    }

    let successful = 0;
    let failed = 0;

    // Sort by timestamp (oldest first)
    operations.sort((a, b) => a.timestamp - b.timestamp);

    for (const op of operations) {
      try {
        switch (op.type) {
          case 'add':
            await storage.addExpense(op.data);
            break;

          case 'delete':
            await storage.deleteExpense(op.data.expenseId);
            break;

          case 'update':
            await storage.updateExpense(op.data.expenseId, op.data.updates);
            break;
        }

        // Remove successful operation
        await removePendingOperation(op.id);
        successful++;
      } catch (error) {
        console.error(`Failed to process operation ${op.id}:`, error);

        // Increment retry count
        op.retries++;

        // If too many retries, skip and remove
        if (op.retries >= 5) {
          console.warn(`Removing operation ${op.id} after 5 failed attempts`);
          await removePendingOperation(op.id);
          failed++;
        } else {
          // Update retry count
          await addPendingOperation(op);
          failed++;
        }
      }
    }

    return { successful, failed };
  }

  /**
   * Get pending operation count
   */
  async getPendingCount(): Promise<number> {
    const operations = await getPendingOperations();
    return operations.length;
  }
}

// Singleton instance
export const offlineQueue = new OfflineQueue();
