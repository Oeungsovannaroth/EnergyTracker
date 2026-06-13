import { useApiResource } from '../hooks/useApiResource';
import ContentGrid from '../components/ContentGrid';

export default function Spotlight() {
  const { data: spotlights, loading } = useApiResource('/public/spotlights', []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-5xl font-bold text-center mb-4">Spotlight</h1>
      <p className="text-center text-xl text-gray-600 dark:text-gray-300 mb-16">
        Latest developments and success stories
      </p>

      <ContentGrid
        items={spotlights}
        loading={loading}
        getLink={() => '#'}
        mapItem={(item) => ({
          title: item.title,
          desc: item.content,
          image: item.thumbnail,
        })}
      />
    </div>
  );
}
