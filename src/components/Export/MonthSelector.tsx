import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Modal } from '../common/Modal';

interface MonthSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  availableMonths: Date[];
  onSelectMonth: (month: Date | null) => void;
}

export function MonthSelector({
  isOpen,
  onClose,
  availableMonths,
  onSelectMonth,
}: MonthSelectorProps) {
  const handleSelect = (month: Date | null) => {
    onSelectMonth(month);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Seleziona Mese da Esportare" size="sm">
      <div className="space-y-3">
        {/* Export All */}
        <button
          onClick={() => handleSelect(null)}
          className="w-full p-4 text-left border-2 border-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">📊 Tutte le spese</p>
              <p className="text-sm text-gray-600">Export completo</p>
            </div>
            <svg
              className="w-5 h-5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">oppure seleziona un mese</span>
          </div>
        </div>

        {/* Available Months */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {availableMonths.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Nessuna spesa disponibile
            </p>
          ) : (
            availableMonths.map((month) => {
              const monthName = format(month, 'MMMM yyyy', { locale: it });

              return (
                <button
                  key={month.toISOString()}
                  onClick={() => handleSelect(month)}
                  className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition"
                >
                  <p className="font-medium text-gray-900 capitalize">{monthName}</p>
                </button>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
}
