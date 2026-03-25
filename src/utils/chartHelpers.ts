import { startOfMonth, format } from 'date-fns';
import { it } from 'date-fns/locale';
import type { Expense } from '../types/expense';

/**
 * Aggregate expenses by category
 */
export function aggregateByCategory(expenses: Expense[]): Record<string, number> {
  const result: Record<string, number> = {};

  expenses.forEach((expense) => {
    if (!result[expense.category]) {
      result[expense.category] = 0;
    }
    result[expense.category] += expense.amount;
  });

  return result;
}

/**
 * Aggregate expenses by month
 */
export function aggregateByMonth(expenses: Expense[]): Array<{ month: string; total: number }> {
  const monthMap = new Map<string, { date: Date; total: number }>();

  expenses.forEach((expense) => {
    const monthStart = startOfMonth(new Date(expense.date));
    const monthKey = format(monthStart, 'MMM yyyy', { locale: it });

    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, { date: monthStart, total: 0 });
    }
    const current = monthMap.get(monthKey)!;
    current.total += expense.amount;
  });

  // Convert to array and sort by actual date
  return Array.from(monthMap.entries())
    .map(([month, data]) => ({ month, total: data.total, date: data.date }))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map(({ month, total }) => ({ month, total })); // Remove date from final result
}

/**
 * Calculate monthly average
 */
export function calculateMonthlyAverage(expenses: Expense[]): number {
  if (expenses.length === 0) return 0;

  const monthlyTotals = aggregateByMonth(expenses);
  const sum = monthlyTotals.reduce((acc, { total }) => acc + total, 0);

  return monthlyTotals.length > 0 ? sum / monthlyTotals.length : 0;
}

/**
 * Get top spending categories
 */
export function getTopCategories(expenses: Expense[], limit: number = 5): Array<{ category: string; amount: number; percentage: number }> {
  const byCategory = aggregateByCategory(expenses);
  const total = Object.values(byCategory).reduce((sum, amount) => sum + amount, 0);

  return Object.entries(byCategory)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
}

/**
 * Get spending trend (increase/decrease from previous month)
 */
export function getSpendingTrend(expenses: Expense[]): { trend: 'up' | 'down' | 'stable'; percentage: number } {
  const monthlyData = aggregateByMonth(expenses);

  if (monthlyData.length < 2) {
    return { trend: 'stable', percentage: 0 };
  }

  const current = monthlyData[monthlyData.length - 1].total;
  const previous = monthlyData[monthlyData.length - 2].total;

  const change = ((current - previous) / previous) * 100;

  if (Math.abs(change) < 5) {
    return { trend: 'stable', percentage: change };
  }

  return {
    trend: change > 0 ? 'up' : 'down',
    percentage: Math.abs(change),
  };
}
