export default function Cambodia() {
  return (
    <div className="pt-20 pb-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">Cambodia</h1>
          <p className="text-2xl text-emerald-700 font-medium">Powering the Future with Solar Energy</p>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Cambodia is emerging as one of the fastest-growing solar markets in Southeast Asia.
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white p-8 rounded-3xl shadow text-center">
            <div className="text-5xl font-bold text-emerald-600">2.8 GW</div>
            <div className="text-sm text-gray-500 mt-2">Solar Target 2030</div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow text-center">
            <div className="text-5xl font-bold text-emerald-600">5.5</div>
            <div className="text-sm text-gray-500 mt-2">kWh/m²/day Irradiance</div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow text-center">
            <div className="text-5xl font-bold text-emerald-600">28%</div>
            <div className="text-sm text-gray-500 mt-2">Annual Growth</div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow text-center">
            <div className="text-5xl font-bold text-emerald-600">150+</div>
            <div className="text-sm text-gray-500 mt-2">Projects Delivered</div>
          </div>
        </div>

        <div className="prose max-w-none text-gray-700 leading-relaxed">
          <h2 className="text-4xl font-semibold mb-8">Cambodia’s Solar Energy Landscape</h2>
          <p className="text-lg">
            With abundant sunshine, strong government support, and increasing electricity demand, 
            Cambodia is well-positioned to become a regional leader in renewable energy.
          </p>

          <h3 className="text-2xl font-semibold mt-12 mb-6">Major Solar Projects</h3>
          <ul className="space-y-4 text-lg">
            <li><strong>5MW Solar Farm (Siem Reap)</strong> – Achieved 94% performance ratio</li>
            <li><strong>100MW Solar Park (Banteay Meanchey)</strong> – Expected completion 2026</li>
            <li><strong>Rooftop Solar Initiative</strong> – Targeting 300 MW by 2028</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-12 mb-6">Government Policies</h3>
          <p>
            The Cambodian government has set ambitious targets under the National Strategic Development Plan 
            and offers tax incentives, feed-in tariffs, and streamlined permitting for solar projects.
          </p>
        </div>
      </div>
    </div>
  );
}