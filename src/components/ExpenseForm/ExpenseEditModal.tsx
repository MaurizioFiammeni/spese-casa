import { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { AmountInput } from './AmountInput';
import { CategorySelect } from './CategorySelect';
import { DatePicker } from './DatePicker';
import type { ParsedExpense } from '../../types/expense';
import type { Category } from '../../types/category';

interface ExpenseEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  parsedData: ParsedExpense | null;
  onSave: (data: ParsedExpense) => Promise<void>;
  confidence?: number;
}

export function ExpenseEditModal({
  isOpen,
  onClose,
  parsedData,
  onSave,
  confidence = 1,
}: ExpenseEditModalProps) {
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState<Category>('Varie');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form with parsed data
  useEffect(() => {
    if (parsedData) {
      setAmount(parsedData.amount);
      setCategory(parsedData.category as Category);
      setDate(parsedData.date);
      setDescription(parsedData.description);
      setError(null);
    }
  }, [parsedData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (amount <= 0) {
      setError('Inserisci un importo valido');
      return;
    }

    if (!date) {
      setError('Seleziona una data');
      return;
    }

    if (!description.trim()) {
      setError('Inserisci una descrizione');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await onSave({
        amount,
        category,
        date,
        description: description.trim(),
        confidence,
      });

      // Close modal on success
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore durante il salvataggio';
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (!isSaving) {
      onClose();
    }
  };

  const isValid = amount > 0 && date && description.trim().length > 0;
  const isLowConfidence = confidence < 0.5;

  // Footer with buttons
  const modalFooter = (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={handleCancel}
        disabled={isSaving}
        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        Annulla
      </button>
      <button
        type="submit"
        disabled={isSaving || !isValid}
        onClick={handleSubmit}
        className="flex-1 px-4 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
      >
        {isSaving ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Salvataggio...
          </>
        ) : (
          'Salva Spesa'
        )}
      </button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title="Verifica e Modifica Spesa" size="md" footer={modalFooter}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Low confidence warning */}
        {isLowConfidence && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex gap-2">
              <span className="text-yellow-600">⚠️</span>
              <div>
                <p className="text-sm font-medium text-yellow-900">Confidenza bassa</p>
                <p className="text-sm text-yellow-700">
                  Verifica attentamente i dati estratti prima di salvare
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Amount Input */}
        <AmountInput
          value={amount}
          onChange={setAmount}
          disabled={isSaving}
          autoFocus={true}
        />

        {/* Category Select */}
        <CategorySelect
          value={category}
          onChange={setCategory}
          disabled={isSaving}
        />

        {/* Date Picker */}
        <DatePicker
          value={date}
          onChange={setDate}
          disabled={isSaving}
        />

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Descrizione *
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSaving}
            placeholder="Es: Trasporti, Spesa settimanale, etc."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </form>
    </Modal>
  );
}
