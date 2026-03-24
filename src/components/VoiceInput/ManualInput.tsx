import { useState } from 'react';

interface ManualInputProps {
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

export function ManualInput({ onSubmit, disabled = false }: ManualInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (text.trim()) {
      onSubmit(text.trim());
      setText(''); // Clear after submit
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="manual-input"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Oppure inserisci manualmente
          </label>
          <textarea
            id="manual-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Es: Ho speso 45 euro per trasporti oggi"
            rows={3}
            disabled={disabled}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none"
          />
          <p className="mt-2 text-xs text-gray-500">
            Esempi: "Bolletta luce 80 euro oggi" • "Pagato 36.45 supermercato ieri"
          </p>
        </div>

        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Analizza spesa
        </button>
      </form>

      {/* Separator */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-gray-50 text-gray-500">
            Input vocale o manuale
          </span>
        </div>
      </div>
    </div>
  );
}
