import { Link } from "react-router-dom";
import { useMemo } from "react";
import Card from "../components/Card";
import { useApiResource } from "../hooks/useApiResource";

export default function FossilFuel() {
  const { data: contents, loading } =
    useApiResource("/public/fossil-fuel", []);

  const grouped = useMemo(() => {
    const map = {};

    (contents || []).forEach((item) => {
      const key = item.category || "Other";

      if (!map[key]) {
        map[key] = {
          category: { id: key, name: key },
          items: [],
        };
      }

      map[key].items.push(item);
    });

    return Object.values(map);
  }, [contents]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-5xl font-bold text-center mb-4">
        Fossil Fuel
      </h1>

      <p className="text-center text-gray-600 mb-16">
        Market intelligence on coal, oil, gas, and transition pathways
      </p>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : grouped.length === 0 ? (
        <p className="text-center text-gray-500">
          No fossil fuel data available.
        </p>
      ) : (
        grouped.map(({ category, items }) => (
          <div
            key={category.id || category.name}
            className="mb-16"
          >
            <h2 className="text-3xl font-semibold mb-8">
              {category.name}
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {items.map((item) => (
                <Link
                  key={item.id}
                  to={item.link || "#"}
                >
                  <Card
                    title={item.title}
                    desc={item.description || item.desc}
                    image={item.image_url || item.image}
                    category={category.name}
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
