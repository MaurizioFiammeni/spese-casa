import { useAuthStore } from '../../store/authStore';
import { SyncStatus } from './SyncStatus';

interface HeaderProps {
  isOnline?: boolean;
  pendingCount?: number;
  isSyncing?: boolean;
  onSyncNow?: () => void;
}

export function Header({ isOnline = true, pendingCount = 0, isSyncing = false, onSyncNow }: HeaderProps) {
  const { githubUser, logout } = useAuthStore();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏠</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Spese Casa</h1>
            <p className="text-xs text-gray-500">Gestione spese vocale</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Sync Status */}
          <SyncStatus
            isOnline={isOnline}
            pendingCount={pendingCount}
            isSyncing={isSyncing}
            onSyncNow={onSyncNow}
          />

          {githubUser && (
            <div className="flex items-center gap-3">
              {githubUser.avatarUrl && (
                <img
                  src={githubUser.avatarUrl}
                  alt={githubUser.username}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {githubUser.username}
                </p>
                <p className="text-xs text-gray-500">{githubUser.email}</p>
              </div>
            </div>
          )}

          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Esci
          </button>
        </div>
      </div>
    </header>
  );
}
