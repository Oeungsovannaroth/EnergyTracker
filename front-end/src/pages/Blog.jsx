import { useApiResource } from "../hooks/useApiResource";
import ContentGrid from "../components/ContentGrid";

export default function Blog() {
  const { data: response, loading } = useApiResource("/public/blogs", {
    data: [],
  });

  const { data: categoriesResponse } = useApiResource(
    "/public/categories",
    {
      data: [],
    }
  );

  const posts = response?.data ?? response ?? [];

  // Handle both array and { data: [] } response structures
  const categoryList = Array.isArray(categoriesResponse)
    ? categoriesResponse
    : categoriesResponse?.data ?? [];

  const getCategoryName = (categoryId) => {
    const category = categoryList.find(
      (c) =>
        String(c._id || c.id) === String(categoryId)
    );

    return category?.name || "Unknown";
  };

  // Debug logs
  // console.log("Posts:", posts);
  // console.log("Categories Response:", categoriesResponse);
  // console.log("Category List:", categoryList);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-5xl font-bold text-center mb-16">
        Blog & Insights
      </h1>

      <ContentGrid
        items={posts}
        loading={loading}
        getLink={(item) =>
          item.slug ? `/blog/post/${item.slug}` : "#"
        }
        mapItem={(item) => ({
          title: item.title,
          desc: item.content,
          image: item.thumbnail,
          category: getCategoryName(item.category_id),
        })}
      />
    </div>
  );
}