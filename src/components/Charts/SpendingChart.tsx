import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { Expense } from '../../types/expense';
import { aggregateByCategory } from '../../utils/chartHelpers';
import { CATEGORY_COLORS } from '../../utils/constants';

interface SpendingChartProps {
  expenses: Expense[];
}

// Convert Tailwind classes to hex colors for charts
const CHART_COLORS: Record<string, string> = {
  'bg-blue-500': '#3b82f6',
  'bg-green-500': '#22c55e',
  'bg-purple-500': '#a855f7',
  'bg-yellow-500': '#eab308',
  'bg-red-500': '#ef4444',
  'bg-indigo-500': '#6366f1',
  'bg-cyan-500': '#06b6d4',
  'bg-amber-500': '#f59e0b',
  'bg-pink-500': '#ec4899',
  'bg-gray-500': '#6b7280',
  'bg-rose-500': '#f43f5e',
  'bg-slate-500': '#64748b',
  'bg-teal-500': '#14b8a6',
};

export function SpendingChart({ expenses }: SpendingChartProps) {
  const categoryData = aggregateByCategory(expenses);

  if (expenses.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>Nessun dato disponibile</p>
      </div>
    );
  }

  // Convert to array for Recharts
  const chartData = Object.entries(categoryData).map(([category, amount]) => {
    const tailwindClass = CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS];
    return {
      name: category,
      value: amount,
      color: CHART_COLORS[tailwindClass] || '#6b7280',
    };
  });

  // Sort by value descending
  chartData.sort((a, b) => b.value - a.value);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Spese per Categoria
        </h3>
        <p className="text-3xl font-bold text-primary">
          €{total.toFixed(2)}
        </p>
        <p className="text-sm text-gray-500">Totale</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name}: ${((percent || 0) * 100).toFixed(0)}%`
            }
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any) =>
              new Intl.NumberFormat('it-IT', {
                style: 'currency',
                currency: 'EUR',
              }).format(Number(value) || 0)
            }
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      {/* Top categories list */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Top 5 Categorie</h4>
        <div className="space-y-2">
          {chartData.slice(0, 5).map((item) => {
            const percentage = (item.value / total) * 100;
            return (
              <div key={item.name} className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.name}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-sm font-bold text-gray-900">
                    €{item.value.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
