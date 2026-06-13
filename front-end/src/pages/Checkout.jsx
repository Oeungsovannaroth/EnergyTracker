import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, ShoppingCart } from 'lucide-react';
import { fetchApi, postApi } from '../lib/api';

const emptyForm = {
  customer: '',
  email: '',
  phone: '',
  company: '',
  address: '',
  quantity: 1,
  note: '',
};

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    fetchApi(`/public/products/${id}`)
      .then((payload) => {
        if (mounted) setProduct(payload);
      })
      .catch(() => {
        if (mounted) setError('Product could not be loaded.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  const quantity = Number(form.quantity) || 1;
  const subtotal = product ? (Number(product.price) || 0) * quantity : 0;
  const estimatedTax = subtotal * 0.1;
  const estimatedTotal = subtotal + estimatedTax;

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: name === 'quantity' ? Number(value) : value }));
  }

  async function submitPurchase(event) {
    event.preventDefault();
    if (!product) return;

    setSubmitting(true);
    setError('');

    try {
      const payload = await postApi(`/public/products/${product.id}/purchase`, form);
      const receipt = {
        product,
        customer: { ...form },
        order: payload.order,
        invoice: payload.invoice,
      };

      sessionStorage.setItem(`receipt:${payload.invoice.invoice_number}`, JSON.stringify(receipt));
      navigate(`/shop/receipt/${payload.invoice.invoice_number}`, { state: receipt });
    } catch (apiError) {
      setError(apiError.message || 'Purchase could not be submitted.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20">
        <Link to="/#shop" className="mb-8 inline-flex items-center gap-2 font-semibold text-emerald-600">
          <ArrowLeft className="h-4 w-4" /> Back to shop
        </Link>
        <h1 className="mb-4 text-4xl font-bold">Checkout unavailable</h1>
        <p className="text-gray-600">{error || 'The selected product is not available.'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 dark:bg-gray-950 dark:text-white">
      <div className="mx-auto max-w-6xl px-6">
        <Link to={`/shop/${product.id}`} className="mb-8 inline-flex items-center gap-2 font-semibold text-emerald-600">
          <ArrowLeft className="h-4 w-4" /> Back to product
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <form onSubmit={submitPurchase} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h1 className="mb-6 text-3xl font-bold">Checkout</h1>

            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="grid gap-5 md:grid-cols-2">
              {[
                ['customer', 'Full name', 'text', true],
                ['email', 'Email', 'email', true],
                ['phone', 'Phone', 'text', false],
                ['company', 'Company', 'text', false],
                ['address', 'Project address', 'text', false],
              ].map(([name, label, type, required]) => (
                <label key={name} className={name === 'address' ? 'md:col-span-2' : ''}>
                  <span className="mb-2 block text-sm font-semibold">{label}</span>
                  <input
                    name={name}
                    type={type}
                    required={required}
                    value={form[name]}
                    onChange={updateField}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-950 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </label>
              ))}

              <label>
                <span className="mb-2 block text-sm font-semibold">Quantity</span>
                <input
                  name="quantity"
                  type="number"
                  min="1"
                  max="20"
                  value={form.quantity}
                  onChange={updateField}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-950 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <label className="md:col-span-2">
                <span className="mb-2 block text-sm font-semibold">Note</span>
                <textarea
                  name="note"
                  rows={4}
                  value={form.note}
                  onChange={updateField}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-950 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-4 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
            >
              <ShoppingCart className="h-5 w-5" />
              {submitting ? 'Processing...' : 'Process to Checkout'}
            </button>
          </form>

          <aside className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-4 text-xl font-bold">Order Summary</h2>
            <div className="space-y-3 border-b border-gray-200 pb-5 dark:border-gray-800">
              <div>
                <p className="font-semibold">{product.title}</p>
                <p className="text-sm text-gray-500">{product.category}</p>
              </div>
              <div className="flex justify-between text-sm">
                <span>Unit price</span>
                <span>{product.currency || 'USD'} {(Number(product.price) || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Quantity</span>
                <span>{quantity}</span>
              </div>
            </div>
            <div className="space-y-3 py-5 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{product.currency || 'USD'} {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated tax</span>
                <span>{product.currency || 'USD'} {estimatedTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{product.currency || 'USD'} {estimatedTotal.toLocaleString()}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
