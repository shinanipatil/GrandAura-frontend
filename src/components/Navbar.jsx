import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services & Events' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-luxury-dark/95 backdrop-blur-md border-b border-gold-400/20">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="font-display text-2xl md:text-3xl text-gold-400 tracking-wider">
            DineCraft
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm uppercase tracking-widest transition-colors ${
                    isActive ? 'text-gold-400' : 'text-white/80 hover:text-gold-400'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Link to="/reservation" className="btn-outline text-xs py-2 px-5">
              Book a Table
            </Link>
            <Link to="/cart" className="relative text-gold-400 hover:text-gold-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold-400 text-luxury-dark text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>
            {user ? (
              <>
                <Link
                  to={isAdmin ? '/admin' : '/dashboard'}
                  className="text-white/80 hover:text-gold-400 text-sm uppercase tracking-wider"
                >
                  {isAdmin ? 'Admin' : 'Dashboard'}
                </Link>
                <button onClick={handleLogout} className="text-white/60 hover:text-white text-sm">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-primary text-xs py-2 px-5">
                Login
              </Link>
            )}
          </div>

          <button className="lg:hidden text-gold-400" onClick={() => setOpen(!open)} aria-label="Menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <div className="lg:hidden pb-6 space-y-4 animate-fade-in">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="block text-white/80 hover:text-gold-400 uppercase tracking-wider text-sm"
              >
                {link.label}
              </NavLink>
            ))}
            <Link to="/reservation" onClick={() => setOpen(false)} className="btn-outline block text-center">
              Book a Table
            </Link>
            <Link to="/cart" onClick={() => setOpen(false)} className="block text-gold-400">
              Cart ({itemCount})
            </Link>
            {user ? (
              <>
                <Link to={isAdmin ? '/admin' : '/dashboard'} onClick={() => setOpen(false)} className="block text-white">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="text-white/60">Logout</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="btn-primary block text-center">
                Login
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
