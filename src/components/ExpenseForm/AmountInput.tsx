interface AmountInputProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  autoFocus?: boolean;
}

export function AmountInput({ value, onChange, disabled = false, autoFocus = false }: AmountInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    // Allow empty string
    if (val === '') {
      onChange(0);
      return;
    }

    // Parse float
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0) {
      onChange(num);
    }
  };

  const isValid = value > 0;

  return (
    <div>
      <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
        Importo *
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
          €
        </span>
        <input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          max="100000"
          value={value || ''}
          onChange={handleChange}
          disabled={disabled}
          autoFocus={autoFocus}
          className={`w-full pl-10 pr-4 py-3 border rounded-lg outline-none transition ${
            isValid
              ? 'border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent'
              : 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent'
          }`}
          placeholder="0.00"
        />
      </div>
      {!isValid && value === 0 && (
        <p className="mt-1 text-sm text-red-600">L'importo è obbligatorio</p>
      )}
      {value > 100000 && (
        <p className="mt-1 text-sm text-red-600">L'importo è troppo alto (max €100.000)</p>
      )}
    </div>
  );
}
