import { useEffect, useState } from 'react';
import { menuAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatINR } from '../utils/currency';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80';

export default function Menu() {
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const { addItem } = useCart();

  useEffect(() => {
    menuAPI.getCategories().then((r) => setCategories(r.data.data || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { limit: 50 };
    if (search) params.search = search;
    if (category) params.category = category;
    menuAPI
      .getDishes(params)
      .then((r) => setDishes(r.data.data || []))
      .finally(() => setLoading(false));
  }, [search, category]);

  const handleAdd = (dish) => {
    addItem(dish);
    toast.success(`${dish.name} added to cart`);
  };

  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-subtitle">Our Menu</p>
          <h1 className="section-title">Culinary Delights</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <input
            type="search"
            placeholder="Search menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-luxury flex-1 max-w-md"
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory('')}
              className={`px-4 py-2 text-sm uppercase tracking-wider transition-colors ${
                !category ? 'bg-gold-400 text-luxury-dark' : 'bg-white border hover:border-gold-400'
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.slug)}
                className={`px-4 py-2 text-sm uppercase tracking-wider transition-colors ${
                  category === c.slug ? 'bg-gold-400 text-luxury-dark' : 'bg-white border hover:border-gold-400'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {dishes.map((dish) => (
              <div key={dish.id} className="card-luxury group">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={dish.image || PLACEHOLDER}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {dish.is_featured && (
                    <span className="absolute top-4 left-4 bg-gold-400 text-luxury-dark text-xs px-3 py-1 uppercase tracking-wider font-semibold">
                      Featured
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-gold-500 text-xs uppercase tracking-wider mb-1">{dish.category_name}</p>
                  <h3 className="font-display text-2xl mb-2">{dish.name}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{dish.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold text-luxury-dark">{formatINR(dish.price)}</span>
                    <button onClick={() => handleAdd(dish)} className="btn-dark text-xs py-2 px-4">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !dishes.length && (
          <p className="text-center text-gray-500 py-12">No dishes found.</p>
        )}
      </div>
    </div>
  );
}
