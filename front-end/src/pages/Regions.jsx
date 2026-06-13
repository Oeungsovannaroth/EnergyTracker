import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import Card from '../components/Card';
import { useApiResource } from '../hooks/useApiResource';

export default function Regions() {
  const { data: regions, loading: regionsLoading } = useApiResource('/public/regions', []);
  const { data: countries, loading: countriesLoading } = useApiResource('/public/countries', []);

  const grouped = useMemo(() => {
    const map = {};
    (regions || []).forEach((region) => {
      const id = region.id ?? region._id;
      map[id] = { region: { ...region, id }, countries: [] };
    });
    (countries || []).forEach((country) => {
      const key = country.region_id;
      if (!map[key]) map[key] = { region: { name: 'Other' }, countries: [] };
      map[key].countries.push(country);
    });
    return Object.values(map);
  }, [regions, countries]);

  const loading = regionsLoading || countriesLoading;

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-5xl font-bold text-center mb-16">Regions</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading regions...</p>
      ) : grouped.length === 0 ? (
        <p className="text-center text-gray-500">No regions yet. Add them in Admin → Regions.</p>
      ) : (
        grouped.map(({ region, countries: regionCountries }) => (
          <div key={region.id || region.name} className="mb-16">
            <h2 className="text-3xl font-semibold mb-8">{region.name}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {regionCountries.map((country) => (
                <Link key={country.id} to={`/regions/${country.slug}`} className="block">
                  <Card
                    title={`${country.flag || ''} ${country.name}`}
                    desc={country.description}
                    category={region.name}
                  />
                </Link>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
