import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { MainLayout } from './components/MainLayout';
import { ErrorBoundary } from './components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    </ErrorBoundary>
  );
}

export default App;
