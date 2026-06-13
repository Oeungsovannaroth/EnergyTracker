import { Link } from 'react-router-dom';
import { ImageOff, ShoppingCart } from 'lucide-react';
import { mediaUrl } from '../lib/mediaUrl';
import { useState } from 'react';

export default function Card({
  title,
  desc,
  image,
  image_url,
  link,
  category,
  icon,
  price,
  currency = 'USD',
  purchaseLabel = 'Buy Now',
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const isProduct = typeof price === 'number' && link;
  const displayImage = image_url || image;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow hover:shadow-2xl transition-all duration-300 group border border-gray-100 dark:border-gray-800">
      <div className="h-48 bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
        {displayImage && !imageFailed ? (
          <img
            src={mediaUrl(displayImage)}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            <ImageOff className="h-10 w-10" />
          </div>
        )}
        {category && (
          <div className="absolute top-4 left-4 bg-emerald-600 text-white text-xs px-3 py-1 rounded-full">
            {category}
          </div>
        )}
      </div>

      <div className="p-6">
        {icon && <div className="text-emerald-600 mb-4">{icon}</div>}

        <h3 className="text-xl font-semibold mb-3 line-clamp-2 text-gray-950 dark:text-white">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-6">{desc}</p>

        {isProduct && (
          <div className="text-2xl font-bold text-gray-950 dark:text-white mb-5">
            {currency} {price.toLocaleString()}
          </div>
        )}

        {isProduct ? (
          <Link
            to={link}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition"
          >
            <ShoppingCart className="w-4 h-4" />
            {purchaseLabel}
          </Link>
        ) : (
          link && (
            <Link
              to={link}
              className="inline-flex items-center text-emerald-600 font-medium hover:text-emerald-700 transition"
            >
              Read More
            </Link>
          )
        )}
      </div>
    </div>
  );
}
