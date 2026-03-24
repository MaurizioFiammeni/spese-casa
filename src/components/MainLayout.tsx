import { Header } from './common/Header';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            🎉 Autenticazione completata!
          </h2>
          <p className="text-gray-600 mb-6">
            Il sistema di autenticazione è funzionante. Le prossime fasi aggiungeranno:
          </p>
          <ul className="text-left max-w-md mx-auto space-y-2 text-gray-700">
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              Storage GitHub per salvare le spese
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              Input vocale italiano
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              Parser locale per estrarre i dati
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              Lista spese con grafici
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
