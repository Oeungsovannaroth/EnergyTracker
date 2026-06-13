import { useApiResource } from '../hooks/useApiResource';
import ContentGrid from '../components/ContentGrid';

export default function Features() {
  const { data: response, loading } = useApiResource('/public/articles', { data: [] });
  const articles = response?.data ?? response ?? [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-5xl font-bold text-center mb-4">Engineering Excellence</h1>
      <p className="text-center text-xl text-gray-600 dark:text-gray-300 mb-16">
        Comprehensive solar solutions designed for Southeast Asian conditions
      </p>
      <ContentGrid
        items={articles}
        loading={loading}
        emptyMessage="No articles yet. Add them in Admin → Articles."
        getLink={(item) => (item.slug ? `/features/${item.slug}` : '#')}
        mapItem={(item) => ({
          title: item.title,
          desc: item.summary || item.content,
          image: item.thumbnail,
        })}
      />
    </div>
  );
}
