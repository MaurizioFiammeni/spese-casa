import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { MainLayout } from './components/MainLayout';

function App() {
  return (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  );
}

export default App;
