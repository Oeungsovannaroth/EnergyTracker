import { useEffect, useMemo } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';

function readReceipt(invoiceNumber, state) {
  if (state?.invoice) return state;

  try {
    const stored = sessionStorage.getItem(`receipt:${invoiceNumber}`);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export default function Receipt() {
  const { invoiceNumber } = useParams();
  const location = useLocation();
  const receipt = useMemo(() => readReceipt(invoiceNumber, location.state), [invoiceNumber, location.state]);

  useEffect(() => {
    if (!receipt) return;

    const timer = window.setTimeout(() => window.print(), 400);
    return () => window.clearTimeout(timer);
  }, [receipt]);

  if (!receipt) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20">
        <Link to="/#shop" className="mb-8 inline-flex items-center gap-2 font-semibold text-emerald-600">
          <ArrowLeft className="h-4 w-4" /> Back to shop
        </Link>
        <h1 className="mb-4 text-4xl font-bold">Receipt not found</h1>
        <p className="text-gray-600">Receipt information is available immediately after checkout.</p>
      </div>
    );
  }

  const { product, customer, order, invoice } = receipt;
  const currency = product?.currency || 'USD';

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10 print:bg-white print:px-0 print:py-0">
      <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-sm print:shadow-none">
        <div className="mb-8 flex items-center justify-between gap-4 print:hidden">
          <Link to="/#shop" className="inline-flex items-center gap-2 font-semibold text-emerald-600">
            <ArrowLeft className="h-4 w-4" /> Back to shop
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white"
          >
            <Printer className="h-4 w-4" />
            Print Receipt
          </button>
        </div>

        <div className="mb-8 border-b border-gray-200 pb-6">
          <p className="text-sm uppercase tracking-widest text-emerald-600">SolarOps Receipt</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-950">{invoice.invoice_number}</h1>
          <p className="mt-1 text-gray-500">Order {order.order_number}</p>
        </div>

        <div className="mb-8 grid gap-6 sm:grid-cols-2">
          <div>
            <h2 className="mb-2 font-semibold text-gray-950">Customer</h2>
            <p>{customer.customer}</p>
            <p>{customer.email}</p>
            {customer.phone && <p>{customer.phone}</p>}
            {customer.company && <p>{customer.company}</p>}
            {customer.address && <p>{customer.address}</p>}
          </div>
          <div>
            <h2 className="mb-2 font-semibold text-gray-950">Receipt Details</h2>
            <p>Status: {invoice.status}</p>
            <p>Product: {product.title}</p>
            <p>Quantity: {customer.quantity}</p>
          </div>
        </div>

        <table className="mb-8 w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="py-3 font-medium">Description</th>
              <th className="py-3 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="py-4">{order.product}</td>
              <td className="py-4 text-right">{currency} {Number(invoice.subtotal).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        <div className="ml-auto max-w-xs space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{currency} {Number(invoice.subtotal).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>{currency} {Number(invoice.tax).toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-3 text-lg font-bold">
            <span>Total</span>
            <span>{currency} {Number(invoice.total).toLocaleString()}</span>
          </div>
        </div>

        {customer.note && (
          <div className="mt-8 rounded-lg bg-gray-50 p-4">
            <h2 className="mb-1 font-semibold text-gray-950">Note</h2>
            <p>{customer.note}</p>
          </div>
        )}
      </div>
    </div>
  );
}
