import { useCallback, useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { authApi } from '../../lib/api';
import Modal from '../components/Modal';
import { normalizeList } from '../utils';

const emptyForm = {
  customer: '',
  email: '',
  product: '',
  amount: '',
  status: 'pending',
};

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const result = await authApi('GET', '/orders');
      setOrders(normalizeList(result.data ?? result));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (order) => {
    setEditing(order);
    setForm({
      customer: order.customer ?? '',
      email: order.email ?? '',
      product: order.product ?? '',
      amount: order.amount ?? '',
      status: order.status ?? 'pending',
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const body = {
        ...form,
        amount: Number(form.amount),
      };

      if (editing) {
        await authApi('PUT', `/orders/${editing.id}`, body);
      } else {
        await authApi('POST', '/orders', body);
      }

      setModalOpen(false);
      await loadOrders();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (order) => {
    if (!window.confirm(`Delete order ${order.order_number}?`)) return;

    try {
      await authApi('DELETE', `/orders/${order.id}`);
      await loadOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-1">Track and update customer orders</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium transition"
        >
          <Plus className="w-4 h-4" />
          Add Order
        </button>
      </div>

      {error && !modalOpen && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left text-gray-500">
              <th className="px-6 py-4 font-medium">Order ID</th>
              <th className="px-6 py-4 font-medium">Customer Name</th>
              <th className="px-6 py-4 font-medium">Customer Email</th>
              <th className="px-6 py-4 font-medium">Product</th>
              <th className="px-6 py-4 font-medium">Quantity</th>
              <th className="px-6 py-4 font-medium">Amount</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-6 py-4 font-mono text-gray-900">{order.order_number}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{order.customer}</p>
                    
                  </td>
                  <td className="px-6 py-4">
                    <a href={`mailto:${order.email}`} className="text-emerald-600 hover:underline">
                      {order.email}
                    </a>
                  </td>
            
                  <td className="px-6 py-4">
                    <p className="text-gray-900">{order.product}</p>
                    {order.product_details && (
                      <p className="text-xs text-gray-500 mt-1">
                        {/* {order.quantity > 1 ? ` · Qty ${order.quantity}` : ''} */}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {order.quantity}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    ${Number(order.amount ?? 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        statusColors[order.status] ?? 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(order)}
                        className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(order)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={modalOpen}
        title={editing ? 'Edit Order' : 'Add Order'}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
            <input
              value={form.customer}
              onChange={(e) => setForm({ ...form, customer: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
            <input
              value={form.product}
              onChange={(e) => setForm({ ...form, product: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-lg font-medium"
            >
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
