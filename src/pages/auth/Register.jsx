import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const { register: signup } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await signup(data);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-luxury-cream">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md card-luxury p-8 space-y-5">
        <h2 className="font-display text-3xl text-center mb-4">Create Account</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-luxury">First Name</label>
            <input {...register('first_name', { required: true })} className="input-luxury" />
          </div>
          <div>
            <label className="label-luxury">Last Name</label>
            <input {...register('last_name', { required: true })} className="input-luxury" />
          </div>
        </div>
        <div>
          <label className="label-luxury">Email</label>
          <input type="email" {...register('email', { required: true })} className="input-luxury" />
        </div>
        <div>
          <label className="label-luxury">Phone</label>
          <input {...register('phone')} className="input-luxury" />
        </div>
        <div>
          <label className="label-luxury">Password</label>
          <input type="password" {...register('password', { required: true, minLength: { value: 6, message: 'Min 6 characters' } })} className="input-luxury" />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>
        <div>
          <label className="label-luxury">Confirm Password</label>
          <input type="password" {...register('confirm', { validate: (v) => v === watch('password') || 'Passwords do not match' })} className="input-luxury" />
          {errors.confirm && <p className="text-red-500 text-sm">{errors.confirm.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-50">Register</button>
        <p className="text-center text-sm">Already have an account? <Link to="/login" className="text-gold-500">Sign In</Link></p>
      </form>
    </div>
  );
}
