import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Expense } from '../../types/expense';
import { aggregateByMonth, getSpendingTrend } from '../../utils/chartHelpers';

interface MonthlyTrendProps {
  expenses: Expense[];
}

export function MonthlyTrend({ expenses }: MonthlyTrendProps) {
  const monthlyData = aggregateByMonth(expenses);
  const trend = getSpendingTrend(expenses);

  if (expenses.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>Nessun dato disponibile</p>
      </div>
    );
  }

  const trendIcon = trend.trend === 'up' ? '📈' : trend.trend === 'down' ? '📉' : '➡️';
  const trendColor = trend.trend === 'up' ? 'text-red-600' : trend.trend === 'down' ? 'text-green-600' : 'text-gray-600';

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Trend Mensile
        </h3>
        {monthlyData.length >= 2 && (
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">{trendIcon}</span>
            <p className={`text-lg font-bold ${trendColor}`}>
              {trend.trend === 'up' ? '+' : trend.trend === 'down' ? '-' : '±'}
              {trend.percentage.toFixed(1)}%
            </p>
            <span className="text-sm text-gray-500">vs mese precedente</span>
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `€${value}`}
          />
          <Tooltip
            formatter={(value: any) =>
              new Intl.NumberFormat('it-IT', {
                style: 'currency',
                currency: 'EUR',
              }).format(Number(value) || 0)
            }
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: '#10b981', r: 5 }}
            activeDot={{ r: 7 }}
            name="Totale Spese"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">
            {monthlyData.length}
          </p>
          <p className="text-sm text-gray-600">Mesi tracciati</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">
            €{calculateMonthlyAverage(expenses).toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">Media mensile</p>
        </div>
      </div>
    </div>
  );
}

function calculateMonthlyAverage(expenses: Expense[]): number {
  const monthlyData = aggregateByMonth(expenses);
  if (monthlyData.length === 0) return 0;

  const sum = monthlyData.reduce((acc, { total }) => acc + total, 0);
  return sum / monthlyData.length;
}
