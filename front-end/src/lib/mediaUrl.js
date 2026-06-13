const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export function mediaUrl(path) {
  if (!path) return '';

  const origin = apiBaseUrl.replace(/\/api\/?$/, '');
  const value = String(path).trim();

  if (value.startsWith('data:') || value.startsWith('blob:')) return value;

  if (value.startsWith('http://') || value.startsWith('https://')) {
    try {
      const url = new URL(value);
      const isLocalHost = ['localhost', '127.0.0.1'].includes(url.hostname);

      if (isLocalHost && url.pathname.startsWith('/storage/')) {
        return `${origin}${url.pathname}${url.search}`;
      }

      return value;
    } catch {
      return value;
    }
  }

  const normalizedPath = value
    .replace(/^storage\/app\/public\//, 'storage/')
    .replace(/^app\/public\//, 'storage/')
    .replace(/^uploads\//, 'storage/uploads/')
    .replace(/^public\//, '')
    .replace(/^\/?storage\//, '/storage/');

  return `${origin}${normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`}`;
}
