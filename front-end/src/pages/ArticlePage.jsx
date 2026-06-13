import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useApiResource } from '../hooks/useApiResource';
import { mediaUrl } from '../lib/mediaUrl';

export default function ArticlePage() {
  const { slug } = useParams();
  const { data: article, loading, error } = useApiResource(`/public/articles/slug/${slug}`, null);
  const articleId = article?.id ?? article?._id;
  const { data: features } = useApiResource(
    articleId ? `/public/features?article_id=${articleId}` : null,
    [],
  );

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!article || error) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold mb-4">Article not found</h1>
        <Link to="/features" className="text-emerald-600 font-semibold">Back to features</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <Link to="/features" className="inline-flex items-center gap-2 text-emerald-600 font-semibold mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Features
      </Link>

      {article.thumbnail && (
        <div className="rounded-2xl overflow-hidden mb-8 aspect-video bg-gray-100">
          <img src={mediaUrl(article.thumbnail)} alt={article.title} className="w-full h-full object-cover" />
        </div>
      )}

      <h1 className="text-4xl md:text-5xl font-bold mb-6">{article.title}</h1>
      {article.summary && (
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">{article.summary}</p>
      )}
      {article.content && (
        <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-200 whitespace-pre-line mb-12">
          {article.content}
        </div>
      )}

      {features?.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-6">Related Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6"
              >
                {feature.image && (
                  <img
                    src={mediaUrl(feature.image)}
                    alt={feature.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
