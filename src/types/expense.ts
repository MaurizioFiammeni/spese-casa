import type { Category } from './category';

export interface Expense {
  id: string; // UUID v4
  amount: number;
  category: Category;
  date: string; // ISO format YYYY-MM-DD
  description: string;
  createdAt: string; // ISO timestamp
  createdBy: string; // GitHub username
  updatedAt: string; // ISO timestamp
}

export interface ParsedExpense {
  amount: number;
  category: string;
  date: string; // ISO format
  description: string;
  confidence: number; // 0-1
}

export interface ExpensesData {
  expenses: Expense[];
  version: number;
}
