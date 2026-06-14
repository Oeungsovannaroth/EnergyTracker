import { Link } from 'react-router-dom';
import { ImageOff, ShoppingBag, ShoppingCart } from 'lucide-react';
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
    <div className="group overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-2xl dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-800">
      <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-800 overflow-hidden">
        {displayImage && !imageFailed ? (
          <img
            src={mediaUrl(displayImage)}
            alt={title}
            className="w-full h-full object-cover transition duration-700 group-hover:scale-110 group-hover:brightness-75"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            <ImageOff className="h-10 w-10" />
          </div>
        )}
        {category && (
          <div className="absolute top-4 left-4 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
            {category}
          </div>
        )}

        {isProduct && desc && (
          <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-gray-950/90 via-gray-950/75 to-transparent p-5 pt-16 text-sm leading-6 text-white transition-transform duration-300 group-hover:translate-y-0">
            <p className="line-clamp-3">{desc}</p>
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
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gray-950 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-gray-950/10 transition-all duration-200 hover:bg-emerald-600 hover:shadow-emerald-900/20 active:scale-95 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            <span className="relative flex h-5 w-5 items-center justify-center">
              <ShoppingBag className="absolute h-5 w-5 transition-all duration-300 group-hover:-translate-y-1 group-hover:opacity-0" />
              <ShoppingCart className="absolute h-5 w-5 translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100" />
            </span>
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
