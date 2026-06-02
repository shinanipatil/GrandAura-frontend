import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/currency';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80';

export default function Cart() {
  const { items, updateQuantity, removeItem, total } = useCart();

  if (!items.length) {
    return (
      <div className="py-24 text-center px-4">
        <h1 className="section-title mb-4">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8">Add delicious dishes from our menu</p>
        <Link to="/menu" className="btn-primary">Browse Menu</Link>
      </div>
    );
  }

  return (
    <div className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="section-title mb-10">Your Cart</h1>
        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <div key={item.dish_id} className="card-luxury p-4 flex gap-4 items-center">
              <img src={item.image || PLACEHOLDER} alt={item.name} className="w-20 h-20 object-cover" />
              <div className="flex-1">
                <h3 className="font-display text-lg">{item.name}</h3>
                <p className="text-gold-500">{formatINR(item.price)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.dish_id, item.quantity - 1)} className="w-8 h-8 border flex items-center justify-center">−</button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.dish_id, item.quantity + 1)} className="w-8 h-8 border flex items-center justify-center">+</button>
              </div>
              <p className="font-semibold w-20 text-right">{formatINR(item.price * item.quantity)}</p>
              <button onClick={() => removeItem(item.dish_id)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
            </div>
          ))}
        </div>
        <div className="card-luxury p-6 flex justify-between items-center">
          <div>
            <p className="text-gray-500">Subtotal</p>
            <p className="text-2xl font-semibold">{formatINR(total)}</p>
            <p className="text-sm text-gray-400">Tax & delivery calculated at checkout</p>
          </div>
          <Link to="/checkout" className="btn-primary">Proceed to Checkout</Link>
        </div>
      </div>
    </div>
  );
}
