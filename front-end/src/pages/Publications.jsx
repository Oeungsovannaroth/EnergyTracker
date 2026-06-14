import { useApiResource } from '../hooks/useApiResource';
import ContentGrid from '../components/ContentGrid';

export default function Publications() {
  const { data: response, loading } = useApiResource('/public/publications', { data: [] });
  const items = response?.data ?? response ?? [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-5xl font-bold text-center mb-16">Publications</h1>
      <ContentGrid
        items={items}
        loading={loading}
        getLink={(item) => item.file_url || '#'}
        mapItem={(item) => ({
          title: item.title,
          desc: item.description,
          image: item.image_url || item.image,
          category: item.publication_type,
        })}
      />
    </div>
  );
}
