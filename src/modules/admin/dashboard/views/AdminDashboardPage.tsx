import { Package, ShoppingBag, Users } from 'lucide-react';
import { SEO } from '@/shared/components/common/SEO';
import { StatCard } from '../../components/StatCard';
import { useDashboard } from '../controllers/useDashboard';

export default function AdminDashboardPage() {
  const { stats, loading } = useDashboard();

  return (
    <>
      <SEO title="Admin Dashboard" />
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total Users"
            value={loading ? '...' : stats.users}
            icon={Users}
            description="Registered users"
          />
          <StatCard
            title="Total Products"
            value={loading ? '...' : stats.products}
            icon={Package}
            description="Listed products"
          />
          <StatCard
            title="Total Orders"
            value={loading ? '...' : stats.orders}
            icon={ShoppingBag}
            description="All orders"
          />
        </div>
      </div>
    </>
  );
}