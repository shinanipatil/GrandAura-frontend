import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { reservationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Reservation() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    if (!user) {
      toast.error('Please login to make a reservation');
      navigate('/login', { state: { from: '/reservation' } });
      return;
    }
    try {
      await reservationAPI.create(data);
      toast.success('Reservation submitted! Awaiting confirmation.');
      navigate('/dashboard/reservations');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create reservation');
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="py-16 px-4 min-h-[80vh]">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-subtitle">Reserve Your Experience</p>
          <h1 className="section-title">Book a Table</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card-luxury p-8 space-y-6">
          <div>
            <label className="label-luxury">Date *</label>
            <input type="date" min={today} {...register('reservation_date', { required: 'Date is required' })} className="input-luxury" />
            {errors.reservation_date && <p className="text-red-500 text-sm mt-1">{errors.reservation_date.message}</p>}
          </div>
          <div>
            <label className="label-luxury">Time *</label>
            <input type="time" {...register('reservation_time', { required: 'Time is required' })} className="input-luxury" />
            {errors.reservation_time && <p className="text-red-500 text-sm mt-1">{errors.reservation_time.message}</p>}
          </div>
          <div>
            <label className="label-luxury">Number of Guests *</label>
            <select {...register('guests', { required: true, valueAsNumber: true })} className="input-luxury">
              {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((n) => (
                <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-luxury">Special Requests</label>
            <textarea rows={4} {...register('special_requests')} placeholder="Dietary requirements, occasion, seating preferences..." className="input-luxury resize-none" />
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-50">
            {isSubmitting ? 'Submitting...' : 'Confirm Reservation'}
          </button>
          {!user && (
            <p className="text-center text-sm text-gray-500">
              <a href="/login" className="text-gold-500 hover:underline">Login</a> or{' '}
              <a href="/register" className="text-gold-500 hover:underline">Register</a> to book
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
