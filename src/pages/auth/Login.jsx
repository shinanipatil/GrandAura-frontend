import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      const user = await login(data.email, data.password);
      toast.success('Welcome back!');
      navigate(user.role === 'admin' ? '/admin' : from);
    } catch (err) {
      toast.error(err.message || err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 bg-luxury-dark items-center justify-center p-12">
        <div className="text-center text-white">
          <h1 className="font-display text-5xl text-gold-400 mb-4">DineCraft</h1>
          <p className="text-white/60">Where every celebration becomes a memory</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8 bg-luxury-cream">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-6">
          <h2 className="font-display text-3xl text-center mb-8">Sign In</h2>
          <div>
            <label className="label-luxury">Email</label>
            <input type="email" {...register('email', { required: 'Email required' })} className="input-luxury" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div>
            <label className="label-luxury">Password</label>
            <input type="password" {...register('password', { required: 'Password required' })} className="input-luxury" />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-gold-500 hover:underline">Forgot password?</Link>
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-50">Sign In</button>
          <p className="text-center text-sm text-gray-500">
            Don&apos;t have an account? <Link to="/register" className="text-gold-500 hover:underline">Register</Link>
          </p>
          <p className="text-center text-xs text-gray-400">Admin: use the email & password you set in backend/.env</p>
        </form>
      </div>
    </div>
  );
}
