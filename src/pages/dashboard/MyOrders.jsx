import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { orderAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatINR } from '../../utils/currency';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-orange-100 text-orange-800',
  out_for_delivery: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    orderAPI.getMy({ limit: 50 }).then((r) => setOrders(r.data.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this order?')) return;
    try {
      await orderAPI.cancel(id);
      toast.success('Order cancelled');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  if (loading) return <LoadingSpinner />;

  const active = orders.filter((o) => !['delivered', 'cancelled'].includes(o.status));
  const history = orders.filter((o) => ['delivered', 'cancelled'].includes(o.status));

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">My Orders</h1>

      <h2 className="text-lg font-semibold mb-4">Current Orders</h2>
      {active.length ? (
        <div className="space-y-4 mb-10">
          {active.map((order) => (
            <OrderCard key={order.id} order={order} onCancel={handleCancel} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mb-10">No active orders</p>
      )}

      <h2 className="text-lg font-semibold mb-4">Order History</h2>
      {history.length ? (
        <div className="space-y-4">
          {history.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No order history</p>
      )}
    </div>
  );
}

function OrderCard({ order, onCancel }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
        <div>
          <p className="font-semibold">{order.order_number}</p>
          <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs uppercase ${statusColors[order.status]}`}>
          {order.status.replace(/_/g, ' ')}
        </span>
      </div>
      {order.items?.map((item) => (
        <p key={item.id} className="text-sm text-gray-600">{item.dish_name} x {item.quantity}</p>
      ))}
      <div className="flex justify-between items-center mt-4 pt-4 border-t">
        <span className="font-semibold">{formatINR(order.total)}</span>
        {onCancel && ['pending', 'confirmed'].includes(order.status) && (
          <button onClick={() => onCancel(order.id)} className="text-red-500 text-sm hover:underline">Cancel</button>
        )}
      </div>
    </div>
  );
}
