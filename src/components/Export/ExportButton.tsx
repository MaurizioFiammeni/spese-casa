import { useState } from 'react';
import { startOfMonth, endOfMonth } from 'date-fns';
import type { Expense } from '../../types/expense';
import { exportToExcel, exportMonthToExcel, getAvailableMonths } from '../../services/excelExport';
import { MonthSelector } from './MonthSelector';

interface ExportButtonProps {
  expenses: Expense[];
  disabled?: boolean;
}

export function ExportButton({ expenses, disabled = false }: ExportButtonProps) {
  const [showMonthSelector, setShowMonthSelector] = useState(false);
  const availableMonths = getAvailableMonths(expenses);

  const handleExport = (selectedMonth: Date | null) => {
    if (expenses.length === 0) {
      alert('Nessuna spesa da esportare');
      return;
    }

    try {
      if (selectedMonth === null) {
        // Export all expenses
        exportToExcel(expenses, { filename: 'spese_tutte.xlsx' });
      } else {
        // Filter expenses for selected month
        const monthStart = startOfMonth(selectedMonth);
        const monthEnd = endOfMonth(selectedMonth);

        const monthExpenses = expenses.filter((exp) => {
          const expDate = new Date(exp.date);
          return expDate >= monthStart && expDate <= monthEnd;
        });

        if (monthExpenses.length === 0) {
          alert('Nessuna spesa trovata per questo mese');
          return;
        }

        exportMonthToExcel(monthExpenses, selectedMonth);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Errore durante l\'esportazione. Riprova.');
    }
  };

  return (
    <>
      <button
        onClick={() => setShowMonthSelector(true)}
        disabled={disabled || expenses.length === 0}
        className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        Esporta Excel
      </button>

      <MonthSelector
        isOpen={showMonthSelector}
        onClose={() => setShowMonthSelector(false)}
        availableMonths={availableMonths}
        onSelectMonth={handleExport}
      />
    </>
  );
}
