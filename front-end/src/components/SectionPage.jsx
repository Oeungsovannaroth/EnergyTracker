import { useApiResource } from '../hooks/useApiResource';
import ContentGrid from './ContentGrid';

export default function SectionPage({ title, subtitle, parentPath, children }) {
  const { data: items, loading } = useApiResource(
    `/public/pages?parent_path=${encodeURIComponent(parentPath)}`,
    [],
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-5xl font-bold text-center mb-4">{title}</h1>
      {subtitle && <p className="text-center text-xl text-gray-600 dark:text-gray-300 mb-16">{subtitle}</p>}
      {children}
      <ContentGrid items={items} loading={loading} getLink={(item) => item.path} />
    </div>
  );
}
