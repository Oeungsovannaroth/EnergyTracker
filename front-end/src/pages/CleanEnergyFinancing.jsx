export default function CleanEnergyFinancing() {
  return (
    <div className="pt-20 pb-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-6xl font-bold mb-6">Clean Energy Financing</h1>
        <p className="text-xl text-gray-600">Investment Opportunities & Funding Mechanisms</p>

        <div className="mt-12 grid md:grid-cols-2 gap-10">
          <div className="bg-white p-10 rounded-3xl shadow">
            <h3 className="text-2xl font-semibold mb-6">Available Mechanisms</h3>
            <ul className="space-y-4">
              <li>Green Climate Fund (GCF)</li>
              <li>ADB & World Bank Climate Funds</li>
              <li>Private Equity & Impact Investors</li>
              <li>Feed-in Tariffs (FiT)</li>
            </ul>
          </div>
          <div className="bg-white p-10 rounded-3xl shadow">
            <h3 className="text-2xl font-semibold mb-6">Why Invest in Cambodia?</h3>
            <p className="text-lg">High returns, strong government support, and growing energy demand.</p>
          </div>
        </div>
      </div>
    </div>
  );
}