import { useEffect, useState } from 'react';
import { authApi } from '../../lib/api';
import MetricCard from '../components/MetricCard';
import OrderPieChart from '../components/OrderPieChart';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    authApi('GET', '/analytics')
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-gray-500">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of users, orders, and revenue</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {data?.metrics?.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status Distribution</h2>
          <OrderPieChart data={data?.orderStatuses ?? []} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <ul className="space-y-3">
            {(data?.recentActivities ?? []).map((activity, index) => (
              <li
                key={index}
                className="text-sm text-gray-600 py-2 border-b border-gray-100 last:border-0"
              >
                {activity}
              </li>
            ))}
            {!data?.recentActivities?.length && (
              <li className="text-sm text-gray-400">No recent activity</li>
            )}
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Customers</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200">
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {(data?.topCustomers ?? []).map((customer) => (
                <tr key={customer.email} className="border-b border-gray-100 last:border-0">
                  <td className="py-3 text-gray-900">{customer.name || '—'}</td>
                  <td className="py-3 text-gray-600">{customer.email}</td>
                  <td className="py-3 text-right font-medium text-gray-900">
                    ${Number(customer.revenue ?? 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
