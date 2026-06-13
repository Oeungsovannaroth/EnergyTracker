import { useApiResource } from '../hooks/useApiResource';
import ContentGrid from '../components/ContentGrid';

export default function BlogFiltered({ categorySlug, title }) {
  const { data: response, loading } = useApiResource(
    `/public/blogs?category_slug=${encodeURIComponent(categorySlug)}`,
    { data: [] },
  );
  const posts = response?.data ?? response ?? [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-5xl font-bold text-center mb-16">{title}</h1>
      <ContentGrid
        items={posts}
        loading={loading}
        getLink={(item) => (item.slug ? `/blog/post/${item.slug}` : '#')}
        mapItem={(item) => ({
          title: item.title,
          desc: item.content,
          image: item.thumbnail,
        })}
      />
    </div>
  );
}
