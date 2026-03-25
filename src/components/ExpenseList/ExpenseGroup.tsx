import { useState } from 'react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import type { Expense } from '../../types/expense';
import { ExpenseItem } from './ExpenseItem';
import { MonthlyTotal } from './MonthlyTotal';

interface ExpenseGroupProps {
  month: Date;
  expenses: Expense[];
  onDelete: (id: string) => Promise<void>;
  onDeleteMonth?: (expenseIds: string[]) => Promise<void>;
}

export function ExpenseGroup({ month, expenses, onDelete, onDeleteMonth }: ExpenseGroupProps) {
  const monthName = format(month, 'MMMM yyyy', { locale: it });
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteMonth = async () => {
    if (!onDeleteMonth) return;

    setIsDeleting(true);
    try {
      const expenseIds = expenses.map(e => e.id);
      await onDeleteMonth(expenseIds);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Failed to delete month:', error);
      alert('Errore durante l\'eliminazione delle spese');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Month Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-900 capitalize">
            {monthName}
          </h2>
          <span className="text-sm text-gray-500">
            {expenses.length} {expenses.length === 1 ? 'spesa' : 'spese'}
          </span>
        </div>

        {/* Delete Month Button */}
        {onDeleteMonth && !showDeleteConfirm && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-300 rounded-lg transition"
            title="Elimina tutte le spese del mese"
          >
            🗑️ Elimina mese
          </button>
        )}

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Eliminare {expenses.length} spese?</span>
            <button
              onClick={handleDeleteMonth}
              disabled={isDeleting}
              className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
            >
              {isDeleting ? 'Eliminazione...' : 'Conferma'}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
              className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition"
            >
              Annulla
            </button>
          </div>
        )}
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
