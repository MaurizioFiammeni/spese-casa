import { useEffect, useState } from 'react';
import { Header } from './common/Header';
import { useGitHubStorage } from '../hooks/useGitHubStorage';
import { useExpenseStore } from '../store/expenseStore';
import { VoiceInput } from './VoiceInput/VoiceInput';
import { ManualInput } from './VoiceInput/ManualInput';
import { useExpenseParser } from '../hooks/useExpenseParser';
import type { ParsedExpense } from '../types/expense';

export function MainLayout() {
  const { storage, isInitialized, isInitializing, error: storageError } = useGitHubStorage();
  const { expenses, isLoading, fetchExpenses, error: expenseError } = useExpenseStore();
  const { parse, error: parserError } = useExpenseParser();
  const [_parsedExpense, setParsedExpense] = useState<ParsedExpense | null>(null);

  // Fetch expenses when storage is initialized
  useEffect(() => {
    if (storage && isInitialized) {
      fetchExpenses(storage).catch((err) => {
        console.error('Failed to fetch expenses:', err);
      });
    }
  }, [storage, isInitialized, fetchExpenses]);

  // Handle transcript from voice or manual input
  const handleTranscript = (text: string) => {
    console.log('Transcript received:', text);

    // Parse the expense
    const parsed = parse(text);

    if (parsed) {
      setParsedExpense(parsed);

      // Show parsed result (temporary - will be replaced by modal in Phase 6)
      const message = `✅ Spesa parsata con successo!\n\n` +
        `Importo: €${parsed.amount.toFixed(2)}\n` +
        `Categoria: ${parsed.category}\n` +
        `Data: ${parsed.date}\n` +
        `Descrizione: ${parsed.description}\n` +
        `Confidenza: ${(parsed.confidence * 100).toFixed(0)}%\n\n` +
        (parsed.confidence < 0.5 ? '⚠️ Confidenza bassa - verifica i dati!\n\n' : '') +
        `Nella Fase 6 verrà aggiunto il modal per modificare questi dati prima di salvare.`;

      alert(message);
    } else {
      alert(`❌ Errore nel parsing:\n\n${parserError}\n\nRiprova con un formato più chiaro.\n\nEsempio: "Ho speso 45 euro per trasporti oggi"`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Initialization Status */}
        {isInitializing && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3">
              <svg
                className="animate-spin h-6 w-6 text-blue-600"
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
              <div>
                <p className="font-medium text-blue-900">Inizializzazione in corso...</p>
                <p className="text-sm text-blue-700">Creazione del repository GitHub per i dati</p>
              </div>
            </div>
          </div>
        )}

        {/* Storage Error */}
        {storageError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h3 className="font-medium text-red-900 mb-2">Errore di inizializzazione</h3>
            <p className="text-sm text-red-700">{storageError}</p>
          </div>
        )}

        {/* Expense Error */}
        {expenseError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h3 className="font-medium text-red-900 mb-2">Errore</h3>
            <p className="text-sm text-red-700">{expenseError}</p>
          </div>
        )}

        {/* Voice Input Section */}
        {isInitialized && !isLoading && (
          <>
            <div className="bg-white rounded-lg shadow p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
                Aggiungi una Spesa
              </h2>

              {/* Voice Input */}
              <VoiceInput onTranscript={handleTranscript} disabled={false} />

              {/* Manual Input */}
              <ManualInput onSubmit={handleTranscript} disabled={false} />
            </div>

            {/* Expense Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                📊 Statistiche
              </h3>
              <div className="bg-primary/5 rounded-lg p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-3xl font-bold text-primary">{expenses.length}</p>
                    <p className="text-sm text-gray-600">Spese totali</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-primary">
                      €{expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">Totale speso</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-primary">13</p>
                    <p className="text-sm text-gray-600">Categorie</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <svg
              className="animate-spin h-8 w-8 mx-auto mb-4 text-primary"
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
            <p className="text-gray-600">Caricamento spese...</p>
          </div>
        )}
      </main>
    </div>
  );
}
