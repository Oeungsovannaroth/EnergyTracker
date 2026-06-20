import { Link, useParams } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { useApiResource } from '../hooks/useApiResource';
import { mediaUrl } from '../lib/mediaUrl';

function getYouTubeEmbedUrl(url) {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes('youtube.com')) {
      const videoId = parsed.searchParams.get('v');
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (parsed.hostname.includes('youtu.be')) {
      const videoId = parsed.pathname.replace('/', '');
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
  } catch {
    return null;
  }

  return null;
}

function MediaPlayer({ item }) {
  const source = mediaUrl(item.media_url);
  const youtubeEmbedUrl = getYouTubeEmbedUrl(item.media_url);

  if (!source) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
        No media URL available.
      </div>
    );
  }

  if (youtubeEmbedUrl) {
    return (
      <iframe
        src={youtubeEmbedUrl}
        title={item.title}
        className="aspect-video w-full rounded-lg bg-black"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (item.type === 'podcast') {
    return (
      <audio controls className="w-full">
        <source src={source} />
        Your browser does not support the audio element.
      </audio>
    );
  }

  if (item.type === 'video') {
    return (
      <video controls poster={mediaUrl(item.thumbnail_url || item.thumbnail)} className="aspect-video w-full rounded-lg bg-black">
        <source src={source} />
        Your browser does not support the video element.
      </video>
    );
  }

  return (
    <a
      href={source}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
    >
      Open Media
      <ExternalLink className="h-4 w-4" />
    </a>
  );
}

export default function MediaDetail() {
  const { id } = useParams();
  const { data: item, loading, error } = useApiResource(`/public/media/${id}`, null);

  if (loading) {
    return <p className="px-6 py-16 text-center text-gray-500">Loading...</p>;
  }

  if (error || !item) {
    return <p className="px-6 py-16 text-center text-gray-500">Media item not found.</p>;
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <Link to={item.type === 'video' ? '/media/videos' : '/media'} className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
        Back to media
      </Link>

      <div className="mt-6">
        <div className="mb-5 flex flex-wrap items-center gap-3 text-sm text-gray-500">
          <span className="rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-700">
            {item.type}
          </span>
          {item.duration && <span>{item.duration}</span>}
        </div>

        <h1 className="mb-6 text-4xl font-bold text-gray-950 dark:text-white">{item.title}</h1>

        <MediaPlayer item={item} />

        {item.description && (
          <p className="mt-8 text-lg leading-8 text-gray-700 dark:text-gray-300">{item.description}</p>
        )}
      </div>
    </div>
  );
}
