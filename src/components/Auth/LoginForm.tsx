import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';

export function LoginForm() {
  const [token, setToken] = useState('');
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token.trim()) {
      return;
    }

    try {
      await login(token.trim());
    } catch (err) {
      // Error già gestito nello store
      console.error('Login failed:', err);
    }
  };

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
    if (error) {
      clearError();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <span className="text-3xl">🏠</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Spese Casa
            </h1>
            <p className="text-gray-600">
              Gestione spese con input vocale
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="token"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                GitHub Personal Access Token
              </label>
              <input
                id="token"
                type="password"
                value={token}
                onChange={handleTokenChange}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxxx"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                disabled={isLoading}
                autoComplete="off"
              />
              <p className="mt-2 text-sm text-gray-500">
                Serve per salvare i dati su GitHub
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !token.trim()}
              className="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
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
                  Verifica in corso...
                </>
              ) : (
                'Accedi'
              )}
            </button>
          </form>

          {/* Instructions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Come generare il token:
            </h3>
            <ol className="space-y-2 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="font-medium text-primary">1.</span>
                <span>
                  Vai su{' '}
                  <a
                    href="https://github.com/settings/tokens/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    GitHub Settings → Tokens
                  </a>
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-medium text-primary">2.</span>
                <span>Nome: "Spese Casa"</span>
              </li>
              <li className="flex gap-2">
                <span className="font-medium text-primary">3.</span>
                <span>
                  Scopes: seleziona <code className="px-1 py-0.5 bg-gray-100 rounded text-xs">repo</code>
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-medium text-primary">4.</span>
                <span>Copia il token e incollalo qui sopra</span>
              </li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          I tuoi dati sono salvati su GitHub e accessibili solo a te
        </p>
      </div>
    </div>
  );
}
