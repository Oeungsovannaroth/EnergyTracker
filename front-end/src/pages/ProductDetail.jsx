import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ImageOff, Loader2, ShoppingBag, ShoppingCart } from 'lucide-react';
import { fetchApi } from '../lib/api';
import { mediaUrl } from '../lib/mediaUrl';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageFailed, setImageFailed] = useState(false);

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

  const productImage = product?.image_url || product?.image;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Link to="/#shop" className="inline-flex items-center gap-2 text-emerald-600 font-semibold mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to shop
        </Link>
        <h1 className="text-4xl font-bold mb-4">Product not found</h1>
        <p className="text-gray-600">{error || 'Add products in Admin -> Shop Products.'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 dark:text-white">
      <section className="max-w-7xl mx-auto px-6 py-16">
        <Link to="/#shop" className="inline-flex items-center gap-2 text-emerald-600 font-semibold mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to shop
        </Link>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start">
          <div className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900 aspect-[4/3]">
            {productImage && !imageFailed ? (
              <img
                src={mediaUrl(productImage)}
                alt={product.title}
                className="w-full h-full object-cover"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400">
                <ImageOff className="h-16 w-16" />
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-24">
            <div className="text-sm uppercase tracking-widest text-emerald-600 font-bold mb-3">{product.category}</div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">{product.title}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">{product.desc}</p>
            <div className="text-4xl font-bold mb-8">
              {product.currency || 'USD'} {(product.price || 0).toLocaleString()}
            </div>

            <Link
              to={`/shop/${product.id}/checkout`}
              className="group inline-flex items-center justify-center gap-3 rounded-lg bg-gray-950 px-8 py-4 text-white font-semibold shadow-xl shadow-gray-950/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-emerald-900/20 active:translate-y-0 active:scale-95 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              <span className="relative flex h-5 w-5 items-center justify-center">
                <ShoppingBag className="absolute h-5 w-5 transition-all duration-300 group-hover:-translate-y-1 group-hover:opacity-0" />
                <ShoppingCart className="absolute h-5 w-5 translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100" />
              </span>
              Buy Now
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl font-bold mb-6">What is included</h2>
            <div className="space-y-4">
              {(product.features || []).map((feature) => (
                <div key={feature} className="flex gap-3 text-gray-700 dark:text-gray-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-6">Product details</h2>
            <div className="space-y-4">
              {(product.specs || []).map((spec) => (
                <div key={spec} className="rounded-lg bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 p-4">
                  {spec}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
