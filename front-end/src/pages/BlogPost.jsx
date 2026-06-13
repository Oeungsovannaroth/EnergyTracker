import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useApiResource } from '../hooks/useApiResource';
import { mediaUrl } from '../lib/mediaUrl';

export default function BlogPost() {
  const { slug } = useParams();
  const { data: blog, loading, error } = useApiResource(`/public/blogs/slug/${slug}`, null);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!blog || error) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold mb-4">Post not found</h1>
        <Link to="/blog" className="text-emerald-600 font-semibold">Back to blog</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <Link to="/blog" className="inline-flex items-center gap-2 text-emerald-600 font-semibold mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Blog
      </Link>

      {blog.thumbnail && (
        <div className="rounded-2xl overflow-hidden mb-8 aspect-video bg-gray-100">
          <img src={mediaUrl(blog.thumbnail)} alt={blog.title} className="w-full h-full object-cover" />
        </div>
      )}

      <h1 className="text-4xl md:text-5xl font-bold mb-6">{blog.title}</h1>
      <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-200 whitespace-pre-line">
        {blog.content}
      </div>
    </div>
  );
}
