import { useEffect, useRef, useState } from 'react';
import { fetchApi } from '../lib/api';

export function useApiResource(path, fallbackData = null) {
  const fallbackRef = useRef(fallbackData);
  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(Boolean(path));
  const [error, setError] = useState(null);

  useEffect(() => {
    fallbackRef.current = fallbackData;
  }, [fallbackData]);

  useEffect(() => {
    if (!path) {
      setLoading(false);
      return undefined;
    }

    let mounted = true;
    setLoading(true);

    fetchApi(path)
      .then((payload) => {
        if (!mounted) return;
        setData(payload);
        setError(null);
      })
      .catch((apiError) => {
        if (!mounted) return;
        if (fallbackRef.current !== null) setData(fallbackRef.current);
        setError(apiError);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [path]);

  return { data, loading, error };
}
