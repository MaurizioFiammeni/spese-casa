import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import type { Expense } from '../../types/expense';
import { CategoryBadge } from './CategoryBadge';
import { DeleteButton } from './DeleteButton';

interface ExpenseItemProps {
  expense: Expense;
  onDelete: (id: string) => Promise<void>;
}

export function ExpenseItem({ expense, onDelete }: ExpenseItemProps) {
  const formattedDate = format(new Date(expense.date), 'dd MMM yyyy', { locale: it });
  const formattedAmount = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(expense.amount);

  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      {/* Category Badge */}
      <div className="flex-shrink-0">
        <CategoryBadge category={expense.category} size="md" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <h3 className="font-medium text-gray-900">{expense.description}</h3>
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>
        {expense.createdBy && (
          <p className="text-xs text-gray-400 mt-0.5">
            Aggiunto da {expense.createdBy}
          </p>
        )}
      </div>

      {/* Amount */}
      <div className="flex-shrink-0 text-right">
        <p className="text-lg font-bold text-gray-900">{formattedAmount}</p>
      </div>

      {/* Delete Button */}
      <div className="flex-shrink-0">
        <DeleteButton
          onDelete={() => onDelete(expense.id)}
          expenseDescription={expense.description}
        />
      </div>
    </div>
  );
}
