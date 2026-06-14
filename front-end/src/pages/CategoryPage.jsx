import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchApi } from '../lib/api';
import ContentGrid from '../components/ContentGrid';

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError('');

      try {
        const categoryData = await fetchApi(`/public/categories/slug/${slug}`);
        const pageData = await fetchApi(`/public/categories/${categoryData.id}/pages`);

        if (!mounted) return;
        setCategory(categoryData);
        setPages(Array.isArray(pageData) ? pageData : []);
      } catch (err) {
        if (mounted) setError(err.message || 'Category could not be loaded.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold mb-4">Category not found</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
        <Link to="/" className="text-emerald-600 font-semibold">Back to home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <Link to="/" className="inline-flex items-center gap-2 text-emerald-600 font-semibold mb-8">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      <div className="mb-12">
        <p className="text-sm uppercase tracking-widest text-emerald-600 font-bold mb-3">
          {category.type}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.name}</h1>
        {category.description && (
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl">{category.description}</p>
        )}
      </div>

      <ContentGrid
        items={pages}
        emptyMessage="No published content has been added to this category yet."
        getLink={(item) => item.path || `/category/${slug}`}
        mapItem={(item) => ({
          title: item.title,
          desc: item.description || item.content,
          image: item.image,
          category: item.category || category.name,
          link: item.path || `/category/${slug}`,
        })}
      />
    </div>
  );
}
