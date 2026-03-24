import { format, subDays } from 'date-fns';

interface DatePickerProps {
  value: string; // ISO format YYYY-MM-DD
  onChange: (date: string) => void;
  disabled?: boolean;
}

export function DatePicker({ value, onChange, disabled = false }: DatePickerProps) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

  // Check if date is in future
  const selectedDate = new Date(value);
  const isFuture = selectedDate > new Date();

  return (
    <div>
      <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
        Data *
      </label>

      {/* Quick action buttons */}
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => onChange(today)}
          disabled={disabled}
          className={`px-3 py-1 text-sm rounded-lg transition ${
            value === today
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Oggi
        </button>
        <button
          type="button"
          onClick={() => onChange(yesterday)}
          disabled={disabled}
          className={`px-3 py-1 text-sm rounded-lg transition ${
            value === yesterday
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Ieri
        </button>
      </div>

      {/* Date input */}
      <input
        id="date"
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        max={today}
        className={`w-full px-4 py-3 border rounded-lg outline-none transition ${
          isFuture
            ? 'border-yellow-300 focus:ring-2 focus:ring-yellow-500'
            : 'border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent'
        }`}
      />

      {/* Warning for future dates */}
      {isFuture && (
        <p className="mt-1 text-sm text-yellow-600">
          ⚠️ La data è nel futuro
        </p>
      )}
    </div>
  );
}
