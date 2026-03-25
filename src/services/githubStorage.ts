import { Octokit } from 'octokit';
import type { Expense, ExpensesData } from '../types/expense';

const DATA_REPO_NAME = 'spese-casa-data';
const DATA_FILE_PATH = 'expenses.json';
const DATA_REPO_OWNER = 'MaurizioFiammeni'; // Fixed owner for shared data repository
const MAX_RETRIES = 3;
const RETRY_DELAY_BASE = 1000; // 1 second

export class GitHubStorage {
  private octokit: Octokit;
  private owner: string;
  private repo: string = DATA_REPO_NAME;
  private path: string = DATA_FILE_PATH;
  private currentUser: string; // The logged-in user

  constructor(token: string, currentUser: string) {
    this.octokit = new Octokit({ auth: token });
    this.owner = DATA_REPO_OWNER; // Always use fixed owner for data repo
    this.currentUser = currentUser; // Store for createdBy field
  }

  /**
   * Initialize repository if it doesn't exist
   */
  async initializeRepo(): Promise<void> {
    try {
      // Check if repo exists
      await this.octokit.rest.repos.get({
        owner: this.owner,
        repo: this.repo,
      });
      console.log(`Repository ${this.repo} already exists`);
    } catch (error: any) {
      if (error.status === 404) {
        // Repo doesn't exist, create it
        console.log(`Creating repository ${this.repo}...`);
        await this.octokit.rest.repos.createForAuthenticatedUser({
          name: this.repo,
          private: true,
          description: 'Storage per dati Spese Casa PWA',
          auto_init: false,
        });

        // Create initial expenses.json file
        await this.createInitialFile();
      } else {
        throw error;
      }
    }
  }

  /**
   * Create initial expenses.json file
   */
  private async createInitialFile(): Promise<void> {
    const initialData: ExpensesData = {
      expenses: [],
      version: 1,
    };

    const content = JSON.stringify(initialData, null, 2);
    const base64Content = this.encodeToBase64(content);

    await this.octokit.rest.repos.createOrUpdateFileContents({
      owner: this.owner,
      repo: this.repo,
      path: this.path,
      message: 'Initialize expenses.json',
      content: base64Content,
    });

    console.log('Initial expenses.json created');
  }

  /**
   * Get expenses data with SHA for optimistic locking
   */
  async getExpenses(): Promise<{ data: ExpensesData; sha: string }> {
    try {
      const response = await this.octokit.rest.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: this.path,
      });

      if (!('content' in response.data)) {
        throw new Error('Invalid file response');
      }

      const content = this.decodeFromBase64(response.data.content);
      const data: ExpensesData = JSON.parse(content);

      return {
        data,
        sha: response.data.sha,
      };
    } catch (error: any) {
      if (error.status === 404) {
        // File doesn't exist, create it
        await this.createInitialFile();
        return this.getExpenses(); // Retry
      }
      throw error;
    }
  }

  /**
   * Add a new expense with retry logic
   */
  async addExpense(expense: Omit<Expense, 'id' | 'createdAt' | 'createdBy' | 'updatedAt'>): Promise<Expense> {
    return this.retryOperation(async () => {
      const { data: currentData, sha } = await this.getExpenses();

      // Generate UUID v4
      const id = crypto.randomUUID();
      const now = new Date().toISOString();

      const newExpense: Expense = {
        ...expense,
        id,
        createdAt: now,
        createdBy: this.currentUser, // Use logged-in user, not repo owner
        updatedAt: now,
      };

      currentData.expenses.push(newExpense);
      currentData.version += 1;

      await this.updateFile(currentData, sha, `Add expense: ${expense.description} - €${expense.amount}`);

      return newExpense;
    });
  }

  /**
   * Delete an expense by ID
   */
  async deleteExpense(expenseId: string): Promise<void> {
    return this.retryOperation(async () => {
      const { data: currentData, sha } = await this.getExpenses();

      const expense = currentData.expenses.find((e) => e.id === expenseId);
      if (!expense) {
        throw new Error('Expense not found');
      }

      currentData.expenses = currentData.expenses.filter((e) => e.id !== expenseId);
      currentData.version += 1;

      await this.updateFile(currentData, sha, `Delete expense: ${expenseId}`);
    });
  }

  /**
   * Update an expense by ID
   */
  async updateExpense(expenseId: string, updates: Partial<Omit<Expense, 'id' | 'createdAt' | 'createdBy'>>): Promise<void> {
    return this.retryOperation(async () => {
      const { data: currentData, sha } = await this.getExpenses();

      const expenseIndex = currentData.expenses.findIndex((e) => e.id === expenseId);
      if (expenseIndex === -1) {
        throw new Error('Expense not found');
      }

      currentData.expenses[expenseIndex] = {
        ...currentData.expenses[expenseIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      currentData.version += 1;

      await this.updateFile(currentData, sha, `Update expense: ${expenseId}`);
    });
  }

  /**
   * Encode UTF-8 string to Base64 (modern way)
   */
  private encodeToBase64(str: string): string {
    // Convert string to UTF-8 bytes using TextEncoder
    const encoder = new TextEncoder();
    const bytes = encoder.encode(str);

    // Convert bytes to base64
    let binary = '';
    bytes.forEach(byte => {
      binary += String.fromCharCode(byte);
    });

    return btoa(binary);
  }

  /**
   * Decode Base64 to UTF-8 string (modern way)
   */
  private decodeFromBase64(base64: string): string {
    // Decode base64 to binary
    const binary = atob(base64);

    // Convert binary to bytes
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    // Decode bytes to UTF-8 string
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
  }

  /**
   * Update file with optimistic locking
   */
  private async updateFile(data: ExpensesData, sha: string, message: string): Promise<void> {
    const content = JSON.stringify(data, null, 2);
    const base64Content = this.encodeToBase64(content);

    await this.octokit.rest.repos.createOrUpdateFileContents({
      owner: this.owner,
      repo: this.repo,
      path: this.path,
      message,
      content: base64Content,
      sha,
    });
  }

  /**
   * Retry operation with exponential backoff
   */
  private async retryOperation<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;

        // If it's a 409 conflict, retry
        if (error.status === 409 && attempt < MAX_RETRIES - 1) {
          const delay = RETRY_DELAY_BASE * Math.pow(2, attempt);
          console.log(`Conflict detected, retrying in ${delay}ms... (attempt ${attempt + 1}/${MAX_RETRIES})`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        // For other errors or last attempt, throw
        throw error;
      }
    }

    throw lastError || new Error('Operation failed after retries');
  }
}
