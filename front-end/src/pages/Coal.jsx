export default function Coal() {
  return (
    <div className="pt-20 pb-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-6xl font-bold mb-6 text-center">Coal Energy</h1>
        <p className="text-center text-red-600 text-xl mb-12">Phasing Down for a Cleaner Future</p>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow">
            <h3 className="font-semibold text-2xl mb-4">Current Status</h3>
            <p className="text-4xl font-bold text-amber-600">1.2 GW</p>
            <p className="text-gray-500">Installed Capacity</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow">
            <h3 className="font-semibold text-2xl mb-4">Environmental Impact</h3>
            <p className="text-red-600 font-medium">High CO₂ and air pollution</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow">
            <h3 className="font-semibold text-2xl mb-4">Government Plan</h3>
            <p className="text-emerald-600">No new coal plants after 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}