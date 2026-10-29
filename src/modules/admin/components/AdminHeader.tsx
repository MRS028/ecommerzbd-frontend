import { ThemeToggle } from '@/shared/components/common/ThemeToggle';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { Button } from '@/shared/components/ui/button';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/modules/auth/services/auth.service';

export function AdminHeader() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {}
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 border-b flex items-center justify-between px-6 bg-card">
      <div>
        <h1 className="font-semibold">Welcome back, {user?.name ?? 'Admin'}</h1>
        <p className="text-xs text-muted-foreground">{user?.role}</p>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-1" /> Logout
        </Button>
      </div>
    </header>
  );
}