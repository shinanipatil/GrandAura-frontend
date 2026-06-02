import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const statusStyle = {
  available: 'bg-green-100 text-green-800',
  pending: 'bg-amber-100 text-amber-800',
  occupied: 'bg-red-100 text-red-800',
  reserved: 'bg-amber-100 text-amber-800',
  maintenance: 'bg-gray-100 text-gray-800',
};

const statusLabel = (s) => (s === 'reserved' ? 'pending (reserved)' : s);

export default function AdminTables() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const load = () => adminAPI.tables().then((r) => setTables(r.data.data || [])).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const onSubmit = async (data) => {
    await adminAPI.createTable(data);
    toast.success('Table created');
    setShowForm(false);
    reset();
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete table?')) return;
    await adminAPI.deleteTable(id);
    toast.success('Deleted');
    load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl">Table Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1" /> Available
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mx-2" /> Pending (assigned to booking)
          </p>
        </div>
        <button type="button" onClick={() => setShowForm(true)} className="btn-primary text-sm">Add Table</button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map((t) => (
          <div key={t.id} className="bg-white rounded-lg shadow p-6">
            <h3 className="font-display text-2xl">{t.table_number}</h3>
            <p className="text-gray-500">Capacity: {t.capacity}</p>
            <p className="text-gray-500">Location: {t.location || 'N/A'}</p>
            <span className={`inline-block mt-2 px-2 py-1 text-xs rounded capitalize ${statusStyle[t.status] || statusStyle.available}`}>
              {statusLabel(t.status)}
            </span>
            <button type="button" onClick={() => handleDelete(t.id)} className="block text-red-500 text-sm mt-4">Delete</button>
          </div>
        ))}
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 max-w-md w-full space-y-4">
            <h3 className="font-display text-xl">Add Table</h3>
            <input {...register('table_number', { required: true })} placeholder="Table Number" className="input-luxury" />
            <input type="number" {...register('capacity', { required: true })} placeholder="Capacity" className="input-luxury" />
            <input {...register('location')} placeholder="Location" className="input-luxury" />
            <select {...register('status')} className="input-luxury" defaultValue="available">
              <option value="available">Available</option>
              <option value="pending">Pending</option>
              <option value="occupied">Occupied</option>
              <option value="reserved">Reserved</option>
              <option value="maintenance">Maintenance</option>
            </select>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 border">Cancel</button>
              <button type="submit" className="btn-primary flex-1">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
