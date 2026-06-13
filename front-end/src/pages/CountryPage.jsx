import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchApi } from '../lib/api';
import ContentGrid from '../components/ContentGrid';

export default function CountryPage() {
  const { slug } = useParams();
  const [country, setCountry] = useState(null);
  const [spotlights, setSpotlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const countryData = await fetchApi(`/public/countries/slug/${slug}`);
        if (!mounted) return;
        setCountry(countryData);

        const spotlightData = await fetchApi(`/public/spotlights?country_id=${countryData.id}`);
        if (mounted) setSpotlights(spotlightData);
      } catch {
        if (mounted) setCountry(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!country) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold mb-4">Country not found</h1>
        <Link to="/regions" className="text-emerald-600 font-semibold">Back to regions</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <Link to="/regions" className="inline-flex items-center gap-2 text-emerald-600 font-semibold mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Regions
      </Link>

      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-4">
          {country.flag} {country.name}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl">{country.description}</p>
      </div>

      <h2 className="text-2xl font-semibold mb-6">Spotlights</h2>
      <ContentGrid
        items={spotlights}
        emptyMessage="No spotlights for this country yet."
        getLink={() => '#'}
        mapItem={(item) => ({
          title: item.title,
          desc: item.content,
          image: item.thumbnail,
          category: country.name,
        })}
      />
    </div>
  );
}
