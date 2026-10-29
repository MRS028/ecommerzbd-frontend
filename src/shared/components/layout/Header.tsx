import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, User } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
import { Button } from '@/shared/components/ui/button';
import { useCartStore } from '@/modules/cart/store/cart.store';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { ROUTES, APP_NAME } from '@/shared/lib/constants';
import { cn } from '@/shared/lib/utils';

export function Header() {
  const count = useCartStore((s) => s.count());
  const { isAuthenticated, user, logout } = useAuthStore();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn('text-sm font-medium transition-colors hover:text-primary',
      isActive ? 'text-primary' : 'text-muted-foreground');

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to={ROUTES.HOME} className="text-xl font-bold text-primary">{APP_NAME}</Link>
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to={ROUTES.HOME} className={navLinkClass} end>Home</NavLink>
          <NavLink to={ROUTES.PRODUCTS} className={navLinkClass}>Products</NavLink>
          {isAuthenticated && <NavLink to={ROUTES.ORDERS} className={navLinkClass}>Orders</NavLink>}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to={ROUTES.CART}>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Button>
          </Link>
          {isAuthenticated ? (
            <Button variant="ghost" size="sm" onClick={() => { logout(); }}>
              <User className="h-4 w-4 mr-1" /> {user?.name?.split(' ')[0] ?? 'Logout'}
            </Button>
          ) : (
            <Link to={ROUTES.LOGIN}><Button size="sm">Sign In</Button></Link>
          )}
        </div>
      </div>
    </header>
  );
}