interface MonthlyTotalProps {
  total: number;
  count: number;
}

export function MonthlyTotal({ total, count }: MonthlyTotalProps) {
  const formattedTotal = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(total);

  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
      <div className="flex items-center gap-2">
        <span className="text-2xl">💰</span>
        <div>
          <p className="text-sm text-gray-600">Totale Mese</p>
          <p className="text-xs text-gray-500">{count} {count === 1 ? 'spesa' : 'spese'}</p>
        </div>
      </div>
      <p className="text-2xl font-bold text-primary">{formattedTotal}</p>
    </div>
  );
}
