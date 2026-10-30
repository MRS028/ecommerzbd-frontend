import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/modules/auth/store/auth.store';

const ADMIN_ROLES = ['admin','ADMIN', 'SUPER_ADMIN'];

export function AdminRoute() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user || !ADMIN_ROLES.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}