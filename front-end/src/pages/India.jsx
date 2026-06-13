export default function India() {
  return (
    <div className="pt-20 pb-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-6xl font-bold text-center mb-6">India</h1>
        <p className="text-center text-2xl text-emerald-700 mb-12">Global Solar Powerhouse</p>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-3xl shadow">
            <div className="text-5xl font-bold text-orange-600">85 GW</div>
            <p className="mt-2 text-gray-600">Installed Solar Capacity (2026)</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow">
            <div className="text-5xl font-bold text-orange-600">500 GW</div>
            <p className="mt-2 text-gray-600">Non-fossil target by 2030</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow">
            <div className="text-5xl font-bold text-orange-600">Top 3</div>
            <p className="mt-2 text-gray-600">Largest Solar Market Globally</p>
          </div>
        </div>

        <div className="prose max-w-none">
          <h2 className="text-3xl font-semibold mb-6">Lessons for Cambodia</h2>
          <p>
            India has successfully scaled solar through competitive bidding, innovative financing, 
            and massive manufacturing growth. Cambodia can adapt these strategies for faster deployment.
          </p>
        </div>
      </div>
    </div>
  );
}