import { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatINR } from '../../utils/currency';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.dashboard().then((r) => setStats(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Dashboard Overview</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Total Customers', value: stats?.total_customers, color: 'border-l-4 border-gold-400' },
          { label: 'Total Orders', value: stats?.total_orders, color: 'border-l-4 border-blue-400' },
          { label: 'Total Revenue', value: formatINR(stats?.total_revenue || 0), color: 'border-l-4 border-green-400' },
          { label: 'Reservations', value: stats?.total_reservations, color: 'border-l-4 border-purple-400' },
        ].map((c) => (
          <div key={c.label} className={`bg-white rounded-lg shadow p-6 ${c.color}`}>
            <p className="text-sm text-gray-500 uppercase tracking-wider">{c.label}</p>
            <p className="text-3xl font-semibold mt-2">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-display text-xl mb-4">Popular Dishes</h2>
          {stats?.popular_dishes?.length ? (
            <ul className="space-y-3">
              {stats.popular_dishes.map((d, i) => (
                <li key={i} className="flex justify-between">
                  <span>{d.name}</span>
                  <span className="text-gold-500">{d.total_ordered} orders</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No data yet</p>
          )}
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-display text-xl mb-4">Recent Orders</h2>
          {stats?.recent_orders?.map((o) => (
            <div key={o.id} className="flex justify-between py-2 border-b last:border-0">
              <div>
                <p className="font-medium text-sm">{o.order_number}</p>
                <p className="text-xs text-gray-500">{o.first_name} {o.last_name}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatINR(o.total)}</p>
                <p className="text-xs capitalize">{o.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
