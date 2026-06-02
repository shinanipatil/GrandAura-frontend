import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([
      adminAPI.reservations({ limit: 50 }),
      adminAPI.tables(),
    ])
      .then(([r, t]) => {
        setReservations(r.data.data || []);
        setTables(t.data.data || []);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Failed to load reservations');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const assignTable = async (reservationId, tableId) => {
    try {
      await adminAPI.assignTable(reservationId, tableId);
      toast.success('Table assigned — table status is now Pending');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign table');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await adminAPI.updateReservationStatus(id, { status });
      toast.success('Reservation updated');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const availableTables = (guests) =>
    tables.filter((t) => ['available', 'reserved'].includes(t.status) && t.capacity >= guests);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Reservation Management</h1>
      <p className="text-sm text-gray-500 mb-4">
        Assigning a table sets it from <strong>available</strong> → <strong>pending</strong> and approves the booking.
      </p>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4">Customer</th>
              <th className="text-left p-4">Date / Time</th>
              <th className="text-left p-4">Guests</th>
              <th className="text-left p-4">Table</th>
              <th className="text-left p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.length ? reservations.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-4">{r.first_name} {r.last_name}<br /><span className="text-xs text-gray-400">{r.phone}</span></td>
                <td className="p-4">{new Date(r.reservation_date).toLocaleDateString()} {r.reservation_time?.slice(0, 5)}</td>
                <td className="p-4">{r.guests}</td>
                <td className="p-4 font-medium">{r.table_number || '—'}</td>
                <td className="p-4 capitalize">{r.status}</td>
                <td className="p-4 flex flex-wrap gap-2 items-center">
                  {r.status === 'pending' && (
                    <>
                      <button type="button" onClick={() => updateStatus(r.id, 'approved')} className="text-green-600 text-xs">Approve</button>
                      <button type="button" onClick={() => updateStatus(r.id, 'rejected')} className="text-red-500 text-xs">Reject</button>
                    </>
                  )}
                  {!r.table_number && (
                    <select
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val) assignTable(r.id, Number(val));
                      }}
                      className="text-xs border rounded px-2 py-1"
                      defaultValue=""
                    >
                      <option value="">Assign Table</option>
                      {availableTables(r.guests).map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.table_number} ({t.capacity} seats) — {t.status}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">No reservations yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
