import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const customerLinks = [
  { to: '/dashboard', label: 'Overview', end: true },
  { to: '/dashboard/orders', label: 'My Orders' },
  { to: '/dashboard/reservations', label: 'My Reservations' },
  { to: '/dashboard/profile', label: 'Profile' },
];

const adminLinks = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/menu', label: 'Menu' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/reservations', label: 'Reservations' },
  { to: '/admin/tables', label: 'Tables' },
  { to: '/admin/events', label: 'Event Bookings' },
  { to: '/admin/customers', label: 'Customers' },
];

export default function DashboardLayout({ admin = false }) {
  const { user, logout } = useAuth();
  const links = admin ? adminLinks : customerLinks;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-luxury-dark text-white fixed h-full hidden md:block">
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="font-display text-2xl text-gold-400">DineCraft</Link>
          <p className="text-xs text-white/50 mt-1 uppercase tracking-wider">{admin ? 'Admin Panel' : 'My Account'}</p>
        </div>
        <nav className="p-4 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `block px-4 py-3 text-sm rounded transition-colors ${
                  isActive ? 'bg-gold-400/20 text-gold-400' : 'text-white/70 hover:text-gold-400 hover:bg-white/5'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <p className="text-sm text-white/60 truncate">{user?.first_name} {user?.last_name}</p>
          <button onClick={logout} className="text-xs text-gold-400 mt-2 hover:underline">Logout</button>
        </div>
      </aside>

      <div className="flex-1 md:ml-64">
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center md:hidden">
          <Link to="/" className="font-display text-xl text-gold-500">DineCraft</Link>
          <select
            className="text-sm border rounded px-2 py-1"
            onChange={(e) => { window.location.href = e.target.value; }}
            defaultValue=""
          >
            <option value="" disabled>Navigate</option>
            {links.map((l) => (
              <option key={l.to} value={l.to}>{l.label}</option>
            ))}
          </select>
        </header>
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
