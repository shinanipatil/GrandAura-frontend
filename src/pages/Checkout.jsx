import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import { formatINR } from '../utils/currency';

const DELIVERY_FEE_INR = 49;

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: { delivery_address: user?.address || '' },
  });

  if (!items.length) {
    navigate('/cart');
    return null;
  }

  const onSubmit = async (data) => {
    if (!user) {
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }
    try {
      const orderData = {
        items: items.map((i) => ({ dish_id: i.dish_id, quantity: i.quantity })),
        delivery_address: data.delivery_address,
        notes: data.notes,
      };
      const res = await orderAPI.create(orderData);
      clearCart();
      toast.success(`Order ${res.data.data.order_number} placed!`);
      navigate('/dashboard/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed');
    }
  };

  const tax = total * 0.05;
  const delivery = DELIVERY_FEE_INR;
  const grandTotal = total + tax + delivery;

  return (
    <div className="py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="section-title mb-10">Checkout</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="card-luxury p-6 space-y-4">
            <h3 className="font-display text-xl">Order Summary</h3>
            {items.map((item) => (
              <div key={item.dish_id} className="flex justify-between text-sm">
                <span>{item.name} x {item.quantity}</span>
                <span>{formatINR(item.price * item.quantity)}</span>
              </div>
            ))}
            <hr />
            <div className="flex justify-between"><span>Subtotal</span><span>{formatINR(total)}</span></div>
            <div className="flex justify-between"><span>Tax (5% GST)</span><span>{formatINR(tax)}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>{formatINR(delivery)}</span></div>
            <div className="flex justify-between font-semibold text-lg"><span>Total</span><span>{formatINR(grandTotal)}</span></div>
          </div>

          <div className="card-luxury p-6 space-y-4">
            <h3 className="font-display text-xl">Delivery Details</h3>
            <div>
              <label className="label-luxury">Delivery Address</label>
              <textarea {...register('delivery_address')} rows={3} className="input-luxury resize-none" placeholder="Enter delivery address (optional for pickup)" />
            </div>
            <div>
              <label className="label-luxury">Order Notes</label>
              <textarea {...register('notes')} rows={2} className="input-luxury resize-none" placeholder="Special instructions..." />
            </div>
          </div>

          <div className="card-luxury p-6 bg-gold-50 border border-gold-200">
            <p className="text-sm text-gray-600 mb-2">Payment Integration Ready</p>
            <p className="text-xs text-gray-500">Payment gateway can be connected to the payments table. For now, orders are placed with pending payment status.</p>
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-50">
            {isSubmitting ? 'Placing Order...' : `Place Order — ${formatINR(grandTotal)}`}
          </button>
        </form>
      </div>
    </div>
  );
}
