import { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatINR } from '../../utils/currency';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [activity, setActivity] = useState(null);

  const load = () => {
    setLoading(true);
    adminAPI.customers({ limit: 50, search })
      .then((r) => setCustomers(r.data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const viewActivity = async (id) => {
    setSelected(id);
    const res = await adminAPI.customerActivity(id);
    setActivity(res.data.data);
  };

  const updateStatus = async (id, status) => {
    await adminAPI.updateCustomerStatus(id, status);
    load();
  };

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Customer Management</h1>
      <div className="flex gap-4 mb-6">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..." className="input-luxury max-w-xs" />
        <button onClick={load} className="btn-dark text-sm py-2">Search</button>
      </div>
      {loading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Orders</th>
                <th className="text-left p-4">Reservations</th>
                <th className="text-left p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-4">{c.first_name} {c.last_name}</td>
                  <td className="p-4">{c.email}</td>
                  <td className="p-4">{c.order_count}</td>
                  <td className="p-4">{c.reservation_count}</td>
                  <td className="p-4">
                    <select value={c.status} onChange={(e) => updateStatus(c.id, e.target.value)} className="text-xs border rounded">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <button onClick={() => viewActivity(c.id)} className="text-gold-500 text-xs">View Activity</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {activity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setActivity(null)}>
          <div className="bg-white p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-xl mb-4">Customer Activity</h3>
            <h4 className="font-semibold mb-2">Recent Orders</h4>
            {activity.orders?.map((o) => <p key={o.id} className="text-sm text-gray-600">{o.order_number} — {formatINR(o.total)} ({o.status})</p>)}
            <h4 className="font-semibold mt-4 mb-2">Recent Reservations</h4>
            {activity.reservations?.map((r) => <p key={r.id} className="text-sm text-gray-600">{r.reservation_date} — {r.guests} guests ({r.status})</p>)}
            <button onClick={() => setActivity(null)} className="btn-primary mt-6 w-full">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
