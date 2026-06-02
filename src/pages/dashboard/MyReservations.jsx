import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { reservationAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
  completed: 'bg-blue-100 text-blue-800',
};

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  const load = () => {
    reservationAPI.getMy({ limit: 50 }).then((r) => setReservations(r.data.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this reservation?')) return;
    try {
      await reservationAPI.cancel(id);
      toast.success('Reservation cancelled');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const onEdit = async (data) => {
    try {
      await reservationAPI.update(editing, data);
      toast.success('Reservation updated');
      setEditing(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  if (loading) return <LoadingSpinner />;

  const upcoming = reservations.filter((r) => new Date(r.reservation_date) >= new Date() && r.status !== 'cancelled');
  const history = reservations.filter((r) => new Date(r.reservation_date) < new Date() || r.status === 'cancelled');

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">My Reservations</h1>

      <h2 className="text-lg font-semibold mb-4">Upcoming</h2>
      {upcoming.length ? (
        <div className="space-y-4 mb-10">
          {upcoming.map((r) => (
            <div key={r.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{new Date(r.reservation_date).toLocaleDateString()} at {r.reservation_time?.slice(0, 5)}</p>
                  <p className="text-gray-500">{r.guests} guests {r.table_number && `• Table ${r.table_number}`}</p>
                  {r.special_requests && <p className="text-sm text-gray-400 mt-1">{r.special_requests}</p>}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${statusColors[r.status]}`}>{r.status}</span>
              </div>
              {['pending', 'approved'].includes(r.status) && (
                <div className="flex gap-3 mt-4">
                  <button onClick={() => { setEditing(r.id); reset(r); }} className="text-gold-500 text-sm">Modify</button>
                  <button onClick={() => handleCancel(r.id)} className="text-red-500 text-sm">Cancel</button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mb-10">No upcoming reservations</p>
      )}

      <h2 className="text-lg font-semibold mb-4">History</h2>
      {history.map((r) => (
        <div key={r.id} className="bg-white rounded-lg shadow p-6 mb-4 opacity-75">
          <p>{new Date(r.reservation_date).toLocaleDateString()} — {r.guests} guests</p>
          <span className={`text-xs ${statusColors[r.status]}`}>{r.status}</span>
        </div>
      ))}

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSubmit(onEdit)} className="bg-white p-8 max-w-md w-full space-y-4">
            <h3 className="font-display text-xl">Modify Reservation</h3>
            <input type="date" {...register('reservation_date', { required: true })} className="input-luxury" />
            <input type="time" {...register('reservation_time', { required: true })} className="input-luxury" />
            <input type="number" {...register('guests', { required: true, valueAsNumber: true })} className="input-luxury" />
            <textarea {...register('special_requests')} className="input-luxury" rows={3} />
            <div className="flex gap-3">
              <button type="button" onClick={() => setEditing(null)} className="flex-1 py-2 border">Cancel</button>
              <button type="submit" className="btn-primary flex-1">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
