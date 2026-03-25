import { useMemo } from 'react';
import { startOfMonth } from 'date-fns';
import type { Expense } from '../../types/expense';
import { ExpenseGroup } from './ExpenseGroup';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => Promise<void>;
}

export function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  // Group expenses by month
  const groupedExpenses = useMemo(() => {
    const groups = new Map<string, Expense[]>();

    expenses.forEach((expense) => {
      const monthStart = startOfMonth(new Date(expense.date));
      const monthKey = monthStart.toISOString();

      if (!groups.has(monthKey)) {
        groups.set(monthKey, []);
      }
      groups.get(monthKey)!.push(expense);
    });

    // Sort groups by date descending (newest first)
    const sortedGroups = Array.from(groups.entries()).sort(
      ([keyA], [keyB]) => new Date(keyB).getTime() - new Date(keyA).getTime()
    );

    return sortedGroups.map(([monthKey, exps]) => ({
      month: new Date(monthKey),
      expenses: exps.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    }));
  }, [expenses]);

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
          <span className="text-4xl">📝</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Nessuna spesa registrata
        </h3>
        <p className="text-gray-600 mb-6">
          Inizia aggiungendo la tua prima spesa usando il microfono o l'input manuale
        </p>
        <div className="max-w-sm mx-auto text-left space-y-2 text-sm text-gray-600">
          <p className="flex items-center gap-2">
            <span className="text-primary">→</span>
            Clicca il microfono verde e parla
          </p>
          <p className="flex items-center gap-2">
            <span className="text-primary">→</span>
            Oppure scrivi nella textarea sotto
          </p>
          <p className="flex items-center gap-2">
            <span className="text-primary">→</span>
            Modifica i dati nel modal
          </p>
          <p className="flex items-center gap-2">
            <span className="text-primary">→</span>
            Salva su GitHub!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {groupedExpenses.map(({ month, expenses: monthExpenses }) => (
        <ExpenseGroup
          key={month.toISOString()}
          month={month}
          expenses={monthExpenses}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
