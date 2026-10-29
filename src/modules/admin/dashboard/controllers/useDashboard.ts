import { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboard.service';

export function useDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [u, p, o] = await Promise.all([
          dashboardService.stats(),
          dashboardService.productCount(),
          dashboardService.orderCount(),
        ]);
        setStats({
          users: u.totalUsers,
          products: typeof p === 'number' ? p : 0,
          orders: typeof o === 'number' ? o : 0,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { stats, loading };
}