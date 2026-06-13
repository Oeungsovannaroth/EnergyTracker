import { Link } from 'react-router-dom';
import { ArrowRight, BatteryCharging, Leaf, ShieldCheck, SunMedium } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 dark:text-white">
      <section className="relative min-h-[58vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.apolloenergy.nz/assets/blog/how-much-power-does-a-5kw-solar-system-produce-hero.jpg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/45 to-black/80" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 pb-16 text-white">
          <div className="flex items-center gap-3 text-emerald-300 font-semibold mb-4">
            <SunMedium className="w-6 h-6" />
            Solar Energy Company
          </div>
          <h1 className="text-5xl md:text-7xl font-bold max-w-4xl leading-tight">
            Building reliable solar systems for Cambodia's clean energy future.
          </h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-[0.85fr_1.15fr] gap-12">
        <div>
          <h2 className="text-4xl font-bold mb-6">About Energy Tracker</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Energy Tracker is a solar engineering and clean energy services company focused on practical renewable energy adoption across Cambodia and Southeast Asia. We help homes, businesses, developers, and public institutions plan, monitor, and purchase solar solutions with confidence.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {[
            [<SunMedium className="w-7 h-7" />, 'Solar Design', 'Rooftop and utility-scale design support for local climate and grid conditions.'],
            [<BatteryCharging className="w-7 h-7" />, 'Energy Products', 'Curated solar kits, monitoring services, and feasibility packages for buyers.'],
            [<ShieldCheck className="w-7 h-7" />, 'Reliable Delivery', 'Engineering-led recommendations, transparent estimates, and post-installation support.'],
            [<Leaf className="w-7 h-7" />, 'Clean Impact', 'Projects aligned with lower emissions, energy security, and long-term savings.'],
          ].map(([icon, title, desc]) => (
            <div key={title} className="rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mb-5">
                {icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 dark:bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
          <div>
            <div className="text-5xl font-bold text-emerald-600 mb-2">150+</div>
            <p className="text-gray-600 dark:text-gray-300">projects supported through research, planning, monitoring, and solar advisory.</p>
          </div>
          <div>
            <div className="text-5xl font-bold text-emerald-600 mb-2">2.8 GW</div>
            <p className="text-gray-600 dark:text-gray-300">national solar target we help developers, owners, and communities work toward.</p>
          </div>
          <div>
            <div className="text-5xl font-bold text-emerald-600 mb-2">25 yrs</div>
            <p className="text-gray-600 dark:text-gray-300">typical panel warranty horizon considered in our long-term savings guidance.</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-3xl">
          <h2 className="text-4xl font-bold mb-6">Our mission</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            We make solar energy easier to understand, easier to buy, and easier to operate. Our work connects engineering data, project experience, market research, and customer-ready products so clean power decisions can move from idea to installation.
          </p>
          <Link
            to="/#shop"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-8 py-4 text-white font-semibold hover:bg-emerald-700 transition"
          >
            View Solar Products <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
