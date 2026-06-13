export default function Others() {
  return (
    <div className="pt-20 pb-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-6xl font-bold text-center mb-6">Other Regions</h1>
        <p className="text-center text-xl text-gray-600 max-w-2xl mx-auto">
          Exploring solar potential across Asia and beyond
        </p>

        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow">
            <h3 className="text-2xl font-semibold mb-4">Vietnam</h3>
            <p className="text-gray-600">Rapid solar growth with over 16 GW installed.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow">
            <h3 className="text-2xl font-semibold mb-4">Thailand</h3>
            <p className="text-gray-600">Strong policy support and regional manufacturing hub.</p>
          </div>
        </div>
      </div>
    </div>
  );
}