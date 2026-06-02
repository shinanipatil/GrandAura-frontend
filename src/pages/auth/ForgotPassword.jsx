import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/api';

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await authAPI.forgotPassword(data.email);
      toast.success(res.data.message);
      if (res.data.dev_reset_token) {
        toast(`Dev token: ${res.data.dev_reset_token}`, { duration: 10000 });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-luxury-cream">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md card-luxury p-8 space-y-6">
        <h2 className="font-display text-3xl text-center">Forgot Password</h2>
        <p className="text-gray-500 text-sm text-center">Enter your email to receive a reset link</p>
        <input type="email" {...register('email', { required: true })} placeholder="Email" className="input-luxury" />
        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">Send Reset Link</button>
        <p className="text-center text-sm"><Link to="/login" className="text-gold-500">Back to Login</Link></p>
      </form>
    </div>
  );
}
