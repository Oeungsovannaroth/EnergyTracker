export default function MetricCard({ label, value, change, trend }) {
  const trendColor = trend === 'up' ? 'text-emerald-600' : 'text-red-500';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900">
        {typeof value === 'number' && label.toLowerCase().includes('revenue')
          ? `$${value.toLocaleString()}`
          : value?.toLocaleString?.() ?? value}
      </p>
      {change && <p className={`text-sm mt-2 ${trendColor}`}>{change}</p>}
    </div>
  );
}
