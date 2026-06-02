import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminEvents() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => adminAPI.eventBookings({ limit: 50 }).then((r) => setBookings(r.data.data || [])).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await adminAPI.updateEventBooking(id, { status });
    toast.success('Updated');
    load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Event Bookings</h1>
      <div className="space-y-4">
        {bookings.map((b) => (
          <div key={b.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <h3 className="font-semibold">{b.name}</h3>
                <p className="text-sm text-gray-500">{b.email} • {b.phone}</p>
                {b.service_name && <p className="text-gold-500 text-sm mt-1">{b.service_name}</p>}
                {b.message && <p className="text-gray-600 text-sm mt-2">{b.message}</p>}
              </div>
              <div className="text-right">
                <span className="capitalize text-sm px-2 py-1 bg-gray-100 rounded">{b.status}</span>
                {b.event_date && <p className="text-xs text-gray-400 mt-1">{new Date(b.event_date).toLocaleDateString()}</p>}
              </div>
            </div>
            {b.status === 'pending' && (
              <div className="flex gap-2 mt-4">
                <button onClick={() => updateStatus(b.id, 'approved')} className="text-green-600 text-sm">Approve</button>
                <button onClick={() => updateStatus(b.id, 'rejected')} className="text-red-500 text-sm">Reject</button>
                <button onClick={() => updateStatus(b.id, 'contacted')} className="text-blue-500 text-sm">Mark Contacted</button>
              </div>
            )}
          </div>
        ))}
        {!bookings.length && <p className="text-gray-500">No event bookings yet</p>}
      </div>
    </div>
  );
}
