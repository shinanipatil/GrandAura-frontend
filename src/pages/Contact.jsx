import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { serviceAPI } from '../services/api';

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await serviceAPI.contact(data);
      toast.success('Message sent successfully!');
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    }
  };

  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="section-subtitle">Get in Touch</p>
          <h1 className="section-title">Contact Us</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div>
              <h3 className="font-display text-2xl mb-4">Visit Us</h3>
              <p className="text-gray-600">123 Luxury Boulevard, Bandra West<br />Mumbai, Maharashtra 400050</p>
            </div>
            <div>
              <h3 className="font-display text-2xl mb-4">Contact Details</h3>
              <p className="text-gray-600">Phone: +91 98765 43210<br />Email: info@dinecraft.com</p>
            </div>
            <div>
              <h3 className="font-display text-2xl mb-4">Business Hours</h3>
              <p className="text-gray-600">
                Monday – Friday: 11:00 AM – 11:00 PM<br />
                Saturday – Sunday: 10:00 AM – 12:00 AM
              </p>
            </div>
            <div className="aspect-video bg-gray-200 overflow-hidden">
              <iframe
                title="DineCraft Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.0!2d72.82!3d19.06!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDAzJzM2LjAiTiA3MsKwNDknMTIuMCJF!5e0!3m2!1sen!2sin!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="card-luxury p-8 space-y-6">
            <h3 className="font-display text-2xl mb-2">Send a Message</h3>
            <div>
              <label className="label-luxury">Name *</label>
              <input {...register('name', { required: 'Name is required' })} className="input-luxury" />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="label-luxury">Email *</label>
              <input type="email" {...register('email', { required: 'Email is required' })} className="input-luxury" />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label-luxury">Phone</label>
              <input {...register('phone')} className="input-luxury" />
            </div>
            <div>
              <label className="label-luxury">Message *</label>
              <textarea rows={5} {...register('message', { required: 'Message is required' })} className="input-luxury resize-none" />
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-50">
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
