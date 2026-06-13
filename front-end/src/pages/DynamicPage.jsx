import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useApiResource } from '../hooks/useApiResource';
import { mediaUrl } from '../lib/mediaUrl';

export default function DynamicPage() {
  const { pathname } = useLocation();
  const apiPath = `/public/pages/path/${pathname.replace(/^\//, '')}`;
  const { data: page, loading, error } = useApiResource(apiPath, null);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!page || error) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold mb-4">Page not found</h1>
        <p className="text-gray-600 mb-6">This page has not been published yet. Create it in Admin → Pages.</p>
        <Link to="/" className="text-emerald-600 font-semibold">Back to home</Link>
      </div>
    );
  }

  const parentPath = page.parent_path || '/';

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <Link to={parentPath} className="inline-flex items-center gap-2 text-emerald-600 font-semibold mb-8">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      {page.image && (
        <div className="rounded-2xl overflow-hidden mb-8 aspect-video bg-gray-100">
          <img src={mediaUrl(page.image)} alt={page.title} className="w-full h-full object-cover" />
        </div>
      )}

      {page.category && (
        <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
          {page.category}
        </span>
      )}

      <h1 className="text-4xl md:text-5xl font-bold mb-6">{page.title}</h1>
      {page.description && <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">{page.description}</p>}
      {page.content && (
        <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-200 whitespace-pre-line">
          {page.content}
        </div>
      )}
    </div>
  );
}
