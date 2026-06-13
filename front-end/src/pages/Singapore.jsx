export default function Singapore() {
  return (
    <div className="pt-20 pb-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">Singapore</h1>
          <p className="text-2xl text-emerald-700">Smart Nation & Green Energy Leader</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-3xl shadow text-center">
            <div className="text-5xl font-bold text-emerald-600">2 GW</div>
            <p className="mt-3 text-gray-600">Solar Target by 2030</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow text-center">
            <div className="text-5xl font-bold text-emerald-600">Floating Solar</div>
            <p className="mt-3 text-gray-600">Pioneering Technology</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow text-center">
            <div className="text-5xl font-bold text-emerald-600">Green Plan 2030</div>
            <p className="mt-3 text-gray-600">National Sustainability Blueprint</p>
          </div>
        </div>

        <div className="prose max-w-none text-gray-700 text-lg">
          <p>
            Singapore is a regional leader in clean energy innovation despite limited land. 
            The country is heavily investing in floating solar, solar PV on buildings, and 
            importing green electricity from Cambodia and other neighbors.
          </p>

          <h2 className="text-3xl font-semibold mt-12 mb-6">Key Focus Areas</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li>Expanding solar adoption on rooftops and industrial buildings</li>
            <li>Floating solar farms on reservoirs</li>
            <li>Green data centers and sustainable urban development</li>
            <li>Regional power grid integration (ASEAN Power Grid)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}