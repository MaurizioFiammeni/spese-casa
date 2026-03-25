import type { Expense } from '../../types/expense';
import { SpendingChart } from './SpendingChart';
import { MonthlyTrend } from './MonthlyTrend';
import { getTopCategories } from '../../utils/chartHelpers';

interface ChartsPageProps {
  expenses: Expense[];
}

export function ChartsPage({ expenses }: ChartsPageProps) {
  const topCategories = getTopCategories(expenses, 3);
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          📊 Statistiche e Grafici
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-primary">{expenses.length}</p>
            <p className="text-sm text-gray-600">Spese Totali</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-primary">
              €{total.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">Totale Speso</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-primary">
              €{(total / expenses.length || 0).toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">Media per Spesa</p>
          </div>
        </div>
      </div>

      {/* Top Categories Insight */}
      {topCategories.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>💡 Insight:</strong> Spendi di più in{' '}
            <strong>{topCategories[0].category}</strong> (
            €{topCategories[0].amount.toFixed(2)} -{' '}
            {topCategories[0].percentage.toFixed(1)}% del totale)
          </p>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <SpendingChart expenses={expenses} />
        </div>

        {/* Line Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <MonthlyTrend expenses={expenses} />
        </div>
      </div>
    </div>
  );
}
