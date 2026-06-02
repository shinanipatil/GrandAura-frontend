import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { serviceAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const SERVICE_CATEGORIES = [
  { key: 'buffet', title: 'Buffet Dining', icon: '🍽️' },
  { key: 'wedding', title: 'Wedding Events', icon: '💒' },
  { key: 'engagement', title: 'Engagement Ceremonies', icon: '💍' },
  { key: 'birthday', title: 'Birthday Parties', icon: '🎂' },
  { key: 'corporate', title: 'Corporate Events', icon: '🏢' },
  { key: 'catering', title: 'Catering Services', icon: '🎪' },
];

const PLACEHOLDER = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('buffet');
  const [inquiryService, setInquiryService] = useState(null);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    serviceAPI.getAll().then((r) => setServices(r.data.data || [])).finally(() => setLoading(false));
  }, []);

  const filtered = services.filter((s) => s.category === activeCategory);

  const onInquiry = async (data) => {
    try {
      await serviceAPI.eventBooking({ ...data, service_id: inquiryService?.id });
      toast.success('Inquiry submitted! We will contact you soon.');
      setInquiryService(null);
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit inquiry');
    }
  };

  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-subtitle">Celebrate in Style</p>
          <h1 className="section-title">Services & Events</h1>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {SERVICE_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-5 py-3 text-sm uppercase tracking-wider transition-all ${
                activeCategory === cat.key
                  ? 'bg-gold-400 text-luxury-dark'
                  : 'bg-white border hover:border-gold-400'
              }`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.title}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(filtered.length ? filtered : [{ id: 0, name: 'Coming Soon', description: 'Contact us for custom packages.', pricing_info: 'Custom pricing', slug: '' }]).map((service) => (
              <div key={service.id} className="card-luxury">
                <img src={service.image || PLACEHOLDER} alt={service.name} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="font-display text-2xl mb-2">{service.name}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-3">{service.description}</p>
                  <p className="text-gold-500 font-semibold mb-4">{service.pricing_info}</p>
                  <div className="flex gap-2">
                    <button onClick={() => setInquiryService(service)} className="btn-dark text-xs py-2 px-4 flex-1">
                      Inquiry
                    </button>
                    <button onClick={() => setInquiryService(service)} className="btn-primary text-xs py-2 px-4 flex-1">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {inquiryService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form onSubmit={handleSubmit(onInquiry)} className="bg-white max-w-md w-full p-8 animate-slide-up">
            <h3 className="font-display text-2xl mb-2">Book: {inquiryService.name}</h3>
            <p className="text-gray-500 text-sm mb-6">Fill in your details and we&apos;ll get back to you.</p>
            <div className="space-y-4">
              <input {...register('name', { required: true })} placeholder="Name *" className="input-luxury" />
              <input {...register('email', { required: true })} type="email" placeholder="Email *" className="input-luxury" />
              <input {...register('phone', { required: true })} placeholder="Phone *" className="input-luxury" />
              <input {...register('event_date')} type="date" className="input-luxury" />
              <input {...register('guests')} type="number" placeholder="Number of guests" className="input-luxury" />
              <textarea {...register('message')} placeholder="Message" rows={3} className="input-luxury resize-none" />
            </div>
            <div className="flex gap-3 mt-6">
              <button type="button" onClick={() => setInquiryService(null)} className="flex-1 py-3 border">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 disabled:opacity-50">Submit</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
