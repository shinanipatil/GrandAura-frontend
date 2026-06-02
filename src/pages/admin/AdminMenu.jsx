import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';
import { formatINR } from '../../utils/currency';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminMenu() {
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  const load = async () => {
    setLoading(true);
    const [d, c] = await Promise.all([
      adminAPI.dishes({ limit: 200 }),
      adminAPI.categories(),
    ]);
    const cats = c.data.data || [];
    setCategories(cats);
    setDishes(d.data.data || []);
    if (!selectedCategoryId && cats.length) {
      setSelectedCategoryId(cats[0].id);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredDishes = selectedCategoryId
    ? dishes.filter((d) => d.category_id === selectedCategoryId)
    : dishes;

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  const openAddForm = () => {
    setEditing(null);
    reset({
      category_id: selectedCategoryId || '',
      is_available: true,
    });
    setShowForm(true);
  };

  const openEditForm = (dish) => {
    setEditing(dish.id);
    reset({
      name: dish.name,
      description: dish.description,
      category_id: dish.category_id,
      price: dish.price,
      is_featured: dish.is_featured,
      is_available: dish.is_available,
    });
    setShowForm(true);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (k === 'image' && v?.[0]) formData.append('image', v[0]);
      else if (v !== undefined && v !== '') formData.append(k, v);
    });
    try {
      if (editing) {
        await adminAPI.updateDish(editing, formData);
        toast.success('Dish updated');
      } else {
        await adminAPI.createDish(formData);
        toast.success('Dish created');
      }
      setShowForm(false);
      setEditing(null);
      reset();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this dish?')) return;
    await adminAPI.deleteDish(id);
    toast.success('Deleted');
    load();
  };

  if (loading && !categories.length) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="font-display text-3xl">Menu Management</h1>
        <button onClick={openAddForm} className="btn-primary text-sm" disabled={!selectedCategoryId}>
          Add Dish to {selectedCategory?.name || 'Category'}
        </button>
      </div>

      {/* Category tabs — 4 main categories */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {categories.map((cat) => {
          const count = dishes.filter((d) => d.category_id === cat.id).length;
          const active = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`p-5 text-left rounded-lg border-2 transition-all ${
                active
                  ? 'border-gold-400 bg-gold-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gold-300'
              }`}
            >
              <p className="font-display text-lg text-luxury-dark">{cat.name}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                {count} {count === 1 ? 'item' : 'items'}
              </p>
            </button>
          );
        })}
      </div>

      {selectedCategory && (
        <p className="text-gray-500 mb-4 text-sm">
          Showing menu for <strong className="text-luxury-dark">{selectedCategory.name}</strong>
        </p>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Price (₹)</th>
              <th className="text-left p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDishes.length ? (
              filteredDishes.map((d) => (
                <tr key={d.id} className="border-t">
                  <td className="p-4 font-medium">{d.name}</td>
                  <td className="p-4">{formatINR(d.price)}</td>
                  <td className="p-4">
                    <span className={d.is_available ? 'text-green-600' : 'text-red-500'}>
                      {d.is_available ? 'Available' : 'Unavailable'}
                    </span>
                    {d.is_featured && (
                      <span className="ml-2 text-xs bg-gold-100 text-gold-700 px-2 py-0.5 rounded">Featured</span>
                    )}
                  </td>
                  <td className="p-4 flex gap-2">
                    <button type="button" onClick={() => openEditForm(d)} className="text-gold-500">
                      Edit
                    </button>
                    <button type="button" onClick={() => handleDelete(d.id)} className="text-red-500">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  No dishes in this category. Click &quot;Add Dish&quot; to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4"
          >
            <h3 className="font-display text-xl">
              {editing ? 'Edit' : 'Add'} Dish
              {selectedCategory && !editing && ` — ${selectedCategory.name}`}
            </h3>
            <input {...register('name', { required: true })} placeholder="Name" className="input-luxury" />
            <textarea {...register('description')} placeholder="Description" className="input-luxury" rows={3} />
            <select {...register('category_id', { required: true })} className="input-luxury" defaultValue={selectedCategoryId}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              step="1"
              {...register('price', { required: true })}
              placeholder="Price in ₹"
              className="input-luxury"
            />
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register('is_featured')} /> Featured
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked {...register('is_available')} /> Available
            </label>
            <input type="file" accept="image/*" {...register('image')} />
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 border">
                Cancel
              </button>
              <button type="submit" className="btn-primary flex-1">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
