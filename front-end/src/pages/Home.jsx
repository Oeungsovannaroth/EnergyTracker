import { Link } from 'react-router-dom';
import { ArrowRight, Award, MapPin, Sun, Zap } from 'lucide-react';
import Card from '../components/Card';
import { useApiResource } from '../hooks/useApiResource';

const quickLinks = [
  {
    icon: <Sun className="w-14 h-14 text-emerald-600 mb-6" />,
    title: 'Solar Engineering Hub',
    desc: 'Technical guides, system design tools, cost calculators, and performance analysis.',
    to: '/renewable-energy',
    action: 'Browse Resources',
  },
  {
    icon: <MapPin className="w-14 h-14 text-emerald-600 mb-6" />,
    title: 'Project Database',
    desc: 'Interactive map and database of operational and upcoming solar projects.',
    to: '/regions',
    action: 'View All Projects',
  },
  {
    icon: <Zap className="w-14 h-14 text-emerald-600 mb-6" />,
    title: 'Market Intelligence',
    desc: 'Policy updates, investment trends, electricity prices, and energy transition roadmap.',
    to: '/fossil-fuel',
    action: 'Market Insights',
  },
];

export default function Home() {
  const { data: homeData } = useApiResource('/public/home', { stats: [], featured: [] });
  const { data: shopProducts, loading: productsLoading } = useApiResource('/public/products', []);
  const stats = homeData?.stats ?? [];
  const products = Array.isArray(shopProducts) ? shopProducts : [];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 dark:text-white">
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.apolloenergy.nz/assets/blog/how-much-power-does-a-5kw-solar-system-produce-hero.jpg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/55 to-black/75" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 text-center text-white z-10 pt-16">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Solar Engineering
            <br />
            <span className="text-emerald-400">Powering Southeast Asia</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-10">
            Cambodia's platform for solar energy development, project tracking, engineering resources, and clean energy products.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/renewable-energy"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center gap-3 text-lg transition"
            >
              Explore Solar Solutions <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#shop"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition text-lg"
            >
              Shop Products
            </a>
          </div>
        </div>
      </section>

      {stats.length > 0 && (
        <section className="bg-emerald-700 py-8 text-white">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl md:text-5xl font-bold mb-1">{stat.value}</div>
                <div className="text-emerald-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Explore Our Resources</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {quickLinks.map((item) => (
            <div key={item.title} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-10 rounded-lg hover:shadow-xl transition group">
              {item.icon}
              <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{item.desc}</p>
              <Link to={item.to} className="text-emerald-600 font-medium inline-flex items-center gap-2 group-hover:gap-3 transition">
                {item.action} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section id="shop" className="bg-gray-50 dark:bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4">Featured Solar Shop</h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12">
            {productsLoading ? 'Loading products...' : products.length ? 'Products are managed from Admin -> Shop Products.' : 'No products yet. Add them in Admin -> Shop Products.'}
          </p>

          {productsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-96 animate-pulse rounded-lg border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-950">
                  <div className="h-48 bg-gray-100 dark:bg-gray-800" />
                  <div className="space-y-4 p-6">
                    <div className="h-5 w-2/3 rounded bg-gray-100 dark:bg-gray-800" />
                    <div className="h-4 rounded bg-gray-100 dark:bg-gray-800" />
                    <div className="h-4 w-4/5 rounded bg-gray-100 dark:bg-gray-800" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((item) => (
              <Card
                key={item.id || item.title}
                {...item}
                link={`/shop/${item.id}`}
              />
            ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-emerald-700 text-white py-20 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <Award className="w-20 h-20 mx-auto mb-6 text-emerald-300" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Power Cambodia?</h2>
          <Link
            to="/about"
            className="inline-block bg-white text-emerald-700 px-10 py-4 rounded-lg text-xl font-semibold hover:bg-emerald-50 transition"
          >
            About Our Company
          </Link>
        </div>
      </section>
    </div>
  );
}
