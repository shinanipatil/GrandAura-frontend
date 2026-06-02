import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-luxury-dark text-white/70">
      <div className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <h3 className="font-display text-3xl text-gold-400 mb-4">DineCraft</h3>
          <p className="text-sm leading-relaxed max-w-md">
            Where every celebration becomes a memory. Experience world-class cuisine,
            impeccable service, and an ambiance of timeless luxury.
          </p>
        </div>
        <div>
          <h4 className="text-gold-400 uppercase tracking-widest text-sm mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/menu" className="hover:text-gold-400 transition-colors">Menu</Link></li>
            <li><Link to="/reservation" className="hover:text-gold-400 transition-colors">Reservations</Link></li>
            <li><Link to="/services" className="hover:text-gold-400 transition-colors">Events</Link></li>
            <li><Link to="/about" className="hover:text-gold-400 transition-colors">About Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-gold-400 uppercase tracking-widest text-sm mb-4">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>123 Luxury Boulevard, Mumbai</li>
            <li>+91 98765 43210</li>
            <li>info@dinecraft.com</li>
            <li>Mon–Sun: 11:00 AM – 11:00 PM</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} DineCraft. All rights reserved.</p>
      </div>
    </footer>
  );
}
