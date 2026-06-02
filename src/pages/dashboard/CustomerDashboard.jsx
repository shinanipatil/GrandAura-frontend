import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userAPI.dashboard().then((r) => setStats(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="font-display text-3xl mb-2">Welcome, {user?.first_name}!</h1>
      <p className="text-gray-500 mb-8">Manage your orders and reservations</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Total Orders', value: stats?.total_orders, link: '/dashboard/orders', color: 'bg-gold-100' },
          { label: 'Active Orders', value: stats?.active_orders, link: '/dashboard/orders', color: 'bg-blue-100' },
          { label: 'Total Reservations', value: stats?.total_reservations, link: '/dashboard/reservations', color: 'bg-green-100' },
          { label: 'Upcoming', value: stats?.upcoming_reservations, link: '/dashboard/reservations', color: 'bg-purple-100' },
        ].map((card) => (
          <Link key={card.label} to={card.link} className={`${card.color} p-6 rounded-lg hover:shadow-md transition-shadow`}>
            <p className="text-sm text-gray-600 uppercase tracking-wider">{card.label}</p>
            <p className="text-3xl font-semibold mt-2">{card.value ?? 0}</p>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link to="/menu" className="card-luxury p-8 text-center hover:border-gold-400 border-2 border-transparent">
          <span className="text-4xl mb-4 block">🍽️</span>
          <h3 className="font-display text-xl">Order Online</h3>
        </Link>
        <Link to="/reservation" className="card-luxury p-8 text-center hover:border-gold-400 border-2 border-transparent">
          <span className="text-4xl mb-4 block">📅</span>
          <h3 className="font-display text-xl">Book a Table</h3>
        </Link>
      </div>
    </div>
  );
}
