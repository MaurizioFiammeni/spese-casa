import { useEffect } from 'react';
import { Header } from './common/Header';
import { useGitHubStorage } from '../hooks/useGitHubStorage';
import { useExpenseStore } from '../store/expenseStore';

export function MainLayout() {
  const { storage, isInitialized, isInitializing, error: storageError } = useGitHubStorage();
  const { expenses, isLoading, fetchExpenses, error: expenseError } = useExpenseStore();

  // Fetch expenses when storage is initialized
  useEffect(() => {
    if (storage && isInitialized) {
      fetchExpenses(storage).catch((err) => {
        console.error('Failed to fetch expenses:', err);
      });
    }
  }, [storage, isInitialized, fetchExpenses]);

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

        {/* Success State */}
        {isInitialized && !isLoading && (
          <div className="bg-white rounded-lg shadow p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                ✅ Storage GitHub attivo!
              </h2>
              <p className="text-gray-600">
                Repository <code className="px-2 py-1 bg-gray-100 rounded text-sm">spese-casa-data</code> pronto
              </p>
            </div>

            {/* Expense Stats */}
            <div className="bg-primary/5 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-primary">{expenses.length}</p>
                  <p className="text-sm text-gray-600">Spese totali</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">
                    €{expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">Totale</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">13</p>
                  <p className="text-sm text-gray-600">Categorie</p>
                </div>
              </div>
            </div>

            {/* Next Features */}
            <div className="border-t pt-6">
              <h3 className="font-medium text-gray-900 mb-4">Prossime funzionalità:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-gray-400">○</span>
                  Input vocale italiano
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gray-400">○</span>
                  Parser locale per estrarre i dati
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gray-400">○</span>
                  Lista spese con grafici
                </li>
              </ul>
            </div>
          </div>
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
