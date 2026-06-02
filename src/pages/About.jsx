const team = [
  { name: 'Chef Marco Laurent', role: 'Executive Chef', image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=300&q=80' },
  { name: 'Chef Ananya Patel', role: 'Pastry Chef', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=300&q=80' },
  { name: 'James Morrison', role: 'Restaurant Manager', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=80' },
  { name: 'Sofia Reyes', role: 'Events Director', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80' },
];

const values = [
  { title: 'Excellence', desc: 'Uncompromising quality in every dish and every interaction.' },
  { title: 'Hospitality', desc: 'Warm, personalized service that makes every guest feel special.' },
  { title: 'Innovation', desc: 'Creative culinary artistry that pushes boundaries while honoring tradition.' },
  { title: 'Sustainability', desc: 'Responsible sourcing and eco-conscious practices.' },
];

export default function About() {
  return (
    <div>
      <section className="relative h-[50vh] flex items-center justify-center bg-luxury-dark">
        <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80)' }} />
        <div className="relative text-center text-white px-4">
          <p className="section-subtitle text-gold-300">Our Story</p>
          <h1 className="font-display text-5xl md:text-6xl">About DineCraft</h1>
        </div>
      </section>

      <section className="py-24 px-4 max-w-4xl mx-auto text-center">
        <h2 className="section-title mb-8">A Journey of Passion</h2>
        <p className="text-gray-600 leading-relaxed text-lg mb-6">
          Founded in 2010, DineCraft began as a dream to bring world-class luxury dining to our city.
          What started as a intimate 40-seat restaurant has grown into a premier destination for
          fine dining, weddings, and corporate events — without ever compromising our commitment to excellence.
        </p>
        <p className="text-gray-600 leading-relaxed text-lg">
          Today, under the guidance of our award-winning culinary team, we continue to create
          unforgettable experiences for thousands of guests each year.
        </p>
      </section>

      <section className="py-24 bg-luxury-dark text-white px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-subtitle text-gold-400">Meet Our Chef</p>
            <h2 className="font-display text-4xl mb-6">Chef Marco Laurent</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              With over 25 years of experience in Michelin-starred kitchens across Paris, Tokyo, and New York,
              Chef Marco brings a fusion of classical French technique and global flavors to every plate.
            </p>
            <p className="text-white/70 leading-relaxed">
              His philosophy: &ldquo;Food is art, and every guest deserves a masterpiece.&rdquo;
            </p>
          </div>
          <img src={team[0].image} alt="Chef Marco" className="w-full max-w-md mx-auto aspect-square object-cover" />
        </div>
      </section>

      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div>
            <h3 className="font-display text-3xl mb-4 text-gold-500">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To deliver extraordinary culinary experiences that celebrate life&apos;s most precious moments,
              through impeccable food, service, and ambiance.
            </p>
          </div>
          <div>
            <h3 className="font-display text-3xl mb-4 text-gold-500">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              To be recognized as the region&apos;s premier luxury dining and events destination,
              setting the standard for hospitality excellence.
            </p>
          </div>
        </div>

        <h2 className="section-title text-center mb-12">Core Values</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v) => (
            <div key={v.title} className="card-luxury p-8 text-center">
              <h4 className="font-display text-xl mb-3">{v.title}</h4>
              <p className="text-gray-500 text-sm">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title text-center mb-16">Our Team</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name} className="text-center group">
                <div className="overflow-hidden mb-4">
                  <img src={member.image} alt={member.name} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h4 className="font-display text-xl">{member.name}</h4>
                <p className="text-gold-500 text-sm uppercase tracking-wider">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
