import type { ReactNode } from 'react';
import { useAuthStore } from '../../store/authStore';
import { LoginForm } from './LoginForm';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <>{children}</>;
}
