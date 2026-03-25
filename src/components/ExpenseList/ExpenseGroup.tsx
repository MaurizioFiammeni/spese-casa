import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import type { Expense } from '../../types/expense';
import { ExpenseItem } from './ExpenseItem';
import { MonthlyTotal } from './MonthlyTotal';

interface ExpenseGroupProps {
  month: Date;
  expenses: Expense[];
  onDelete: (id: string) => Promise<void>;
}

export function ExpenseGroup({ month, expenses, onDelete }: ExpenseGroupProps) {
  const monthName = format(month, 'MMMM yyyy', { locale: it });
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="space-y-4">
      {/* Month Header */}
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold text-gray-900 capitalize">
          {monthName}
        </h2>
        <span className="text-sm text-gray-500">
          {expenses.length} {expenses.length === 1 ? 'spesa' : 'spese'}
        </span>
      </div>

      {/* Monthly Total */}
      <MonthlyTotal total={total} count={expenses.length} />

      {/* Expenses List */}
      <div className="space-y-3">
        {expenses.map((expense) => (
          <ExpenseItem key={expense.id} expense={expense} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}
