import Card from './Card';
import { mediaUrl } from '../lib/mediaUrl';

export default function ContentGrid({
  items = [],
  loading = false,
  emptyMessage = 'No content available yet. Add items from the admin dashboard.',
  getLink = (item) => item.path || item.link || '#',
  mapItem = (item) => ({
    title: item.title,
    desc: item.description || item.desc || item.summary || item.content,
    image: mediaUrl(item.image || item.thumbnail),
    category: item.category,
    link: getLink(item),
    price: item.price,
    currency: item.currency,
  }),
  
}) {
  if (loading) {
    return <p className="text-center text-gray-500 py-12">Loading...</p>;
  }

  if (!items.length) {
    return <p className="text-center text-gray-500 py-12">{emptyMessage}</p>;
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((item) => {
        const card = mapItem(item);
        return <Card key={item.id || item.path || card.title} {...card} />;
      })}
    </div>
  );
}
