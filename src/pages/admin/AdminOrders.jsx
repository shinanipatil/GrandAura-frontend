import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatINR } from '../../utils/currency';

const statuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const load = () => {
    setLoading(true);
    const params = { limit: 50 };
    if (search.trim()) params.search = search.trim();
    if (statusFilter) params.status = statusFilter;
    adminAPI.orders(params)
      .then((r) => setOrders(r.data.data || []))
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Failed to load orders');
        setOrders([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [statusFilter]);

  const updateStatus = async (id, status) => {
    await adminAPI.updateOrderStatus(id, status);
    toast.success('Status updated');
    load();
  };

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Order Management</h1>
      <div className="flex flex-wrap gap-4 mb-6">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orders..." className="input-luxury max-w-xs" />
        <button onClick={load} className="btn-dark text-sm py-2">Search</button>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-luxury max-w-xs">
          <option value="">All Status</option>
          {statuses.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
        </select>
      </div>
      {loading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4">Order #</th>
                <th className="text-left p-4">Customer</th>
                <th className="text-left p-4">Total</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Date</th>
                <th className="p-4">Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="p-4 font-medium">{o.order_number}</td>
                  <td className="p-4">{o.first_name} {o.last_name}<br /><span className="text-gray-400 text-xs">{o.email}</span></td>
                  <td className="p-4">{formatINR(o.total)}</td>
                  <td className="p-4 capitalize">{o.status.replace(/_/g, ' ')}</td>
                  <td className="p-4 text-xs">{new Date(o.created_at).toLocaleString()}</td>
                  <td className="p-4">
                    <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)} className="text-xs border rounded px-2 py-1">
                      {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!orders.length && (
            <p className="p-8 text-center text-gray-500">No orders found.</p>
          )}
        </div>
      )}
    </div>
  );
}
