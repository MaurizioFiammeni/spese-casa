import { useState, useCallback } from 'react';
import { expenseParser } from '../services/expenseParser';
import type { ParsedExpense } from '../types/expense';

export interface UseExpenseParserReturn {
  parse: (text: string) => ParsedExpense | null;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export function useExpenseParser(): UseExpenseParserReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parse = useCallback((text: string): ParsedExpense | null => {
    setIsLoading(true);
    setError(null);

    try {
      // Parse the text
      const result = expenseParser.parseExpenseText(text);

      // Validate result
      const validation = expenseParser.validateParsedExpense(result);

      if (!validation.isValid) {
        throw new Error(validation.errors.join('. '));
      }

      // Warn if low confidence
      if (result.confidence < 0.5) {
        setError('Parsing incerto. Verifica attentamente i dati prima di salvare.');
      }

      setIsLoading(false);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Impossibile analizzare la spesa. Riprova con un formato più chiaro.';

      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    parse,
    isLoading,
    error,
    clearError,
  };
}
