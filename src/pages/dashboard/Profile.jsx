import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { userAPI, authAPI } from '../../services/api';

export default function Profile() {
  const { user, loadUser } = useAuth();
  const [tab, setTab] = useState('profile');
  const profileForm = useForm({
    defaultValues: { first_name: user?.first_name, last_name: user?.last_name, phone: user?.phone, address: user?.address },
  });
  const passwordForm = useForm();

  const onProfileSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => { if (v && k !== 'profile_image') formData.append(k, v); });
      if (data.profile_image?.[0]) formData.append('profile_image', data.profile_image[0]);
      await userAPI.updateProfile(formData);
      await loadUser();
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      await authAPI.changePassword({ current_password: data.current_password, new_password: data.new_password });
      toast.success('Password changed');
      passwordForm.reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Profile Settings</h1>
      <div className="flex gap-4 mb-8">
        <button onClick={() => setTab('profile')} className={`px-4 py-2 ${tab === 'profile' ? 'bg-gold-400 text-luxury-dark' : 'bg-white border'}`}>Personal Info</button>
        <button onClick={() => setTab('password')} className={`px-4 py-2 ${tab === 'password' ? 'bg-gold-400 text-luxury-dark' : 'bg-white border'}`}>Change Password</button>
      </div>

      {tab === 'profile' && (
        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="bg-white rounded-lg shadow p-8 max-w-lg space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gold-100 flex items-center justify-center text-2xl text-gold-600 overflow-hidden">
              {user?.profile_image ? <img src={user.profile_image} alt="" className="w-full h-full object-cover" /> : user?.first_name?.[0]}
            </div>
            <input type="file" accept="image/*" {...profileForm.register('profile_image')} className="text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label-luxury">First Name</label><input {...profileForm.register('first_name')} className="input-luxury" /></div>
            <div><label className="label-luxury">Last Name</label><input {...profileForm.register('last_name')} className="input-luxury" /></div>
          </div>
          <div><label className="label-luxury">Phone</label><input {...profileForm.register('phone')} className="input-luxury" /></div>
          <div><label className="label-luxury">Address</label><textarea {...profileForm.register('address')} className="input-luxury" rows={3} /></div>
          <p className="text-sm text-gray-500">Email: {user?.email}</p>
          <button type="submit" className="btn-primary">Save Changes</button>
        </form>
      )}

      {tab === 'password' && (
        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="bg-white rounded-lg shadow p-8 max-w-lg space-y-5">
          <div><label className="label-luxury">Current Password</label><input type="password" {...passwordForm.register('current_password', { required: true })} className="input-luxury" /></div>
          <div><label className="label-luxury">New Password</label><input type="password" {...passwordForm.register('new_password', { required: true, minLength: 6 })} className="input-luxury" /></div>
          <button type="submit" className="btn-primary">Update Password</button>
        </form>
      )}
    </div>
  );
}
