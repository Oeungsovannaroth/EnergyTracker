export default function Solar() {
  return (
    <div className="pt-20 pb-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-6xl font-bold text-center mb-6">Solar Energy</h1>
        <p className="text-center text-2xl text-emerald-700 mb-12">The Cornerstone of Southeast Asia’s Energy Transition</p>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-semibold mb-6">Why Solar is Booming</h2>
            <ul className="space-y-4 text-lg">
              <li>✓ Falling technology costs</li>
              <li>✓ High solar irradiance in Cambodia (5.5 kWh/m²/day)</li>
              <li>✓ Government incentives and tax exemptions</li>
              <li>✓ Rapid payback period (4–7 years)</li>
            </ul>
          </div>
          <div className="bg-white p-10 rounded-3xl shadow">
            <h3 className="text-2xl font-semibold mb-6">Cambodia Solar Targets</h3>
            <div className="space-y-6">
              <div><strong>2030:</strong> 2.8 GW Solar Capacity</div>
              <div><strong>2040:</strong> 40% Renewable Energy Share</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}