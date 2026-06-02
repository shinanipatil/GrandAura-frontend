import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const load = () => adminAPI.categories().then((r) => setCategories(r.data.data || [])).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (k === 'image' && v?.[0]) formData.append('image', v[0]);
      else if (v) formData.append(k, v);
    });
    try {
      await adminAPI.createCategory(formData);
      toast.success('Category created');
      setShowForm(false);
      reset();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete category?')) return;
    await adminAPI.deleteCategory(id);
    toast.success('Deleted');
    load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between mb-8">
        <h1 className="font-display text-3xl">Categories</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm">Add Category</button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((c) => (
          <div key={c.id} className="bg-white rounded-lg shadow p-6">
            <h3 className="font-display text-xl">{c.name}</h3>
            <p className="text-gray-500 text-sm">{c.slug}</p>
            <button onClick={() => handleDelete(c.id)} className="text-red-500 text-sm mt-4">Delete</button>
          </div>
        ))}
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 max-w-md w-full space-y-4">
            <h3 className="font-display text-xl">Add Category</h3>
            <input {...register('name', { required: true })} placeholder="Name" className="input-luxury" />
            <textarea {...register('description')} placeholder="Description" className="input-luxury" />
            <input type="number" {...register('sort_order')} placeholder="Sort order" className="input-luxury" />
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
