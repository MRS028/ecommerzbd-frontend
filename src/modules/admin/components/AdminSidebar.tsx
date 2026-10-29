import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  ArrowLeft,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { APP_NAME } from '@/shared/lib/constants';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/users', label: 'Users', icon: Users },
];

export function AdminSidebar() {
  return (
    <aside className="hidden md:flex w-64 border-r flex-col bg-card">
      <div className="p-4 border-b">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-primary">
          <ArrowLeft className="h-4 w-4" />
          {APP_NAME}
        </Link>
        <p className="text-xs text-muted-foreground mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )
            }
          >
            <l.icon className="h-4 w-4" />
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}