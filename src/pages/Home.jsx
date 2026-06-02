import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { menuAPI, serviceAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatINR } from '../utils/currency';

const PLACEHOLDER_FOOD = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80';
const PLACEHOLDER_INTERIOR = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      menuAPI.getDishes({ featured: 'true', limit: 4 }),
      serviceAPI.getReviews(),
    ])
      .then(([dishesRes, reviewsRes]) => {
        setFeatured(dishesRes.data.data || []);
        setReviews(reviewsRes.data.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${PLACEHOLDER_INTERIOR})` }}
        />
        <div className="absolute inset-0 bg-luxury-dark/70" />
        <div className="relative z-10 text-center px-4 max-w-4xl animate-slide-up">
          <p className="section-subtitle text-gold-300">Grand Aura Presents</p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white font-semibold mb-6 leading-tight">
            Where Every Celebration Becomes a Memory
          </h1>
          <p className="text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light">
            Indulge in an extraordinary culinary journey at DineCraft — where luxury meets artistry.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/reservation" className="btn-primary">Book a Table</Link>
            <Link to="/menu" className="btn-outline border-white text-white hover:bg-white hover:text-luxury-dark">Order Online</Link>
            <Link to="/menu" className="btn-outline">View Menu</Link>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in">
            <p className="section-subtitle">Welcome to DineCraft</p>
            <h2 className="section-title mb-6">A Legacy of Culinary Excellence</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Nestled in the heart of the city, DineCraft offers an unparalleled dining experience
              inspired by the finest luxury hotels. Our master chefs craft each dish with passion,
              using the freshest ingredients sourced from around the world.
            </p>
            <Link to="/about" className="text-gold-500 font-semibold uppercase tracking-wider text-sm hover:text-gold-600">
              Discover Our Story →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src={PLACEHOLDER_FOOD} alt="Fine dining" className="w-full h-64 object-cover" />
            <img src={PLACEHOLDER_INTERIOR} alt="Restaurant interior" className="w-full h-64 object-cover mt-8" />
          </div>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="py-24 bg-luxury-dark text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="section-subtitle text-gold-400">Culinary Masterpieces</p>
            <h2 className="font-display text-4xl md:text-5xl text-white">Featured Dishes</h2>
          </div>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featured.map((dish) => (
                <div key={dish.id} className="card-luxury group">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={dish.image || PLACEHOLDER_FOOD}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl text-luxury-dark mb-2">{dish.name}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4">{dish.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-gold-500 font-semibold">{formatINR(dish.price)}</span>
                      <Link to="/menu" className="text-sm text-luxury-dark hover:text-gold-500 uppercase tracking-wider">Order</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Link to="/menu" className="btn-outline border-gold-400 text-gold-400">View Full Menu</Link>
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-24 px-4 bg-gradient-to-r from-luxury-burgundy to-luxury-wine text-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="section-subtitle text-gold-300">Limited Time</p>
          <h2 className="font-display text-4xl md:text-5xl mb-6">Weekend Brunch Special</h2>
          <p className="text-white/80 text-lg mb-8">
            Enjoy our exclusive weekend brunch buffet with live music and complimentary champagne. Starting at ₹1,499 per person.
          </p>
          <Link to="/services" className="btn-primary">Explore Offers</Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-subtitle">Guest Experiences</p>
            <h2 className="section-title">What Our Guests Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {(reviews.length ? reviews : [
              { name: 'Priya Sharma', rating: 5, comment: 'An unforgettable dining experience. Impeccable service!' },
              { name: 'Rajesh Kumar', rating: 5, comment: 'Best wedding venue in the city. Highly recommended.' },
              { name: 'Anita Desai', rating: 5, comment: 'The ambiance rivals five-star hotels.' },
            ]).map((r, i) => (
              <div key={i} className="card-luxury p-8 text-center">
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(r.rating)].map((_, j) => (
                    <span key={j} className="text-gold-400">★</span>
                  ))}
                </div>
                <p className="text-gray-600 italic mb-6">&ldquo;{r.comment}&rdquo;</p>
                <p className="font-semibold text-luxury-dark">{r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-luxury-dark text-center px-4">
        <h2 className="font-display text-4xl md:text-5xl text-white mb-6">Ready for an Unforgettable Experience?</h2>
        <p className="text-white/70 mb-10 max-w-xl mx-auto">Reserve your table or order online for the finest dining experience.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/reservation" className="btn-primary">Book a Table</Link>
          <Link to="/menu" className="btn-outline border-white text-white hover:bg-white hover:text-luxury-dark">Order Online</Link>
        </div>
      </section>
    </>
  );
}
