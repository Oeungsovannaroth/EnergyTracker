export default function Petroleum() {
  return (
    <div className="pt-20 pb-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-6xl font-bold mb-6">Petroleum Products</h1>
        <p className="text-xl text-gray-600">Diesel, Gasoline, and Fuel Oil Market Overview</p>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white p-8 rounded-3xl shadow">
            <h3 className="font-semibold">Diesel</h3>
            <p className="text-4xl font-bold text-blue-600 mt-4">Highest Demand</p>
            <p className="text-sm text-gray-500">Used in transportation & industry</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow">
            <h3 className="font-semibold">Gasoline</h3>
            <p className="text-4xl font-bold text-amber-600 mt-4">Growing Fast</p>
            <p className="text-sm text-gray-500">Rising vehicle ownership</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow">
            <h3 className="font-semibold">Heavy Fuel Oil</h3>
            <p className="text-4xl font-bold text-gray-600 mt-4">Declining</p>
            <p className="text-sm text-gray-500">Being replaced by cleaner sources</p>
          </div>
        </div>
      </div>
    </div>
  );
}