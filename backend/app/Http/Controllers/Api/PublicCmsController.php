<?php

namespace App\Http\Controllers\Api;

use App\Models\Article;
use App\Models\Blog;
use App\Models\Category;
use App\Models\Comment;
use App\Models\Country;
use App\Models\Feature;
use App\Models\Media;
use App\Models\Page;
use App\Models\Publication;
use App\Models\Region;
use App\Models\Spotlight;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicCmsController extends ApiController
{
    public function pages(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'parent_path' => ['nullable', 'string', 'max:500'],
            'category_id' => ['nullable', 'string', 'max:255'],
        ]);

        $query = Page::query()
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->latest();

        if (! empty($validated['parent_path'])) {
            $query->where('parent_path', $validated['parent_path']);
        }

        if (! empty($validated['category_id'])) {
            $query->where('category_id', $validated['category_id']);
        }

        return $this->success($query->get());
    }

    public function navigation(): JsonResponse
    {
        $categories = Category::query()
            ->where('type', 'nav')
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->get();

        $parents = $categories
            ->filter(fn (Category $category) => blank($category->parent_id))
            ->values();

        $items = $parents->map(function (Category $parent) use ($categories) {
            $children = $categories
                ->filter(fn (Category $category) => (string) $category->parent_id === (string) $parent->getKey())
                ->values()
                ->map(fn (Category $child) => $this->categoryNavigationPayload($child))
                ->all();

            $payload = $this->categoryNavigationPayload($parent);

            if ($children) {
                $payload['dropdown'] = $children;
            }

            return $payload;
        });

        return $this->success($items);
    }

    public function pageByPath(string $path): JsonResponse
    {
        $normalized = '/'.ltrim($path, '/');
        $page = Page::query()
            ->where('is_published', true)
            ->where('path', $normalized)
            ->firstOrFail();

        return $this->success($page);
    }

    public function regions(): JsonResponse
    {
        return $this->success(Region::query()->latest()->get());
    }

    public function region(string $id): JsonResponse
    {
        return $this->success(Region::query()->findOrFail($id));
    }

    public function countries(Request $request): JsonResponse
    {
        $query = Country::query()->latest();

        if ($request->filled('region_id')) {
            $query->where('region_id', $request->string('region_id'));
        }

        return $this->success($query->get()->map(fn (Country $country) => $this->countryPayload($country)));
    }

    public function country(string $id): JsonResponse
    {
        return $this->success($this->countryPayload(Country::query()->findOrFail($id)));
    }

    public function countryBySlug(string $slug): JsonResponse
    {
        return $this->success($this->countryPayload(Country::query()->where('slug', $slug)->firstOrFail()));
    }

    public function spotlights(Request $request): JsonResponse
    {
        $query = Spotlight::query()->where('status', true)->latest();

        if ($request->filled('country_id')) {
            $query->where('country_id', $request->string('country_id'));
        }

        return $this->success($query->get());
    }

    public function spotlight(string $id): JsonResponse
    {
        $item = Spotlight::query()->where('status', true)->findOrFail($id);

        return $this->success($item);
    }

    public function categories(Request $request): JsonResponse
    {
        $query = Category::query()->latest();

        if ($request->filled('type')) {
            $query->where('type', $request->string('type'));
        }

        return $this->success($query->get());
    }

    public function categoryBySlug(string $slug): JsonResponse
    {
        return $this->success(Category::query()->where('slug', $slug)->firstOrFail());
    }

    public function categoryPages(string $id): JsonResponse
    {
        $pages = Page::query()
            ->where('category_id', $id)
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->latest()
            ->get();

        return $this->success($pages);
    }

    public function articles(Request $request): JsonResponse
    {
        $query = Article::query()->where('status', 'published')->latest();

        foreach (['category_id', 'country_id', 'author_id'] as $column) {
            if ($request->filled($column)) {
                $query->where($column, $request->string($column));
            }
        }

        if ($request->filled('category_slug')) {
            $categoryIds = Category::query()
                ->where('slug', $request->string('category_slug'))
                ->pluck('_id')
                ->map(fn ($id) => (string) $id);
            $query->whereIn('category_id', $categoryIds);
        }

        return $this->success($query->paginate(15));
    }

    public function article(string $id): JsonResponse
    {
        $article = Article::query()->where('status', 'published')->findOrFail($id);
        $article->increment('views');

        return $this->success($article->fresh());
    }

    public function articleBySlug(string $slug): JsonResponse
    {
        $article = Article::query()->where('status', 'published')->where('slug', $slug)->firstOrFail();
        $article->increment('views');

        return $this->success($article->fresh());
    }

    public function features(Request $request): JsonResponse
    {
        $query = Feature::query()->latest();

        if ($request->filled('article_id')) {
            $query->where('article_id', $request->string('article_id'));
        }

        return $this->success($query->get());
    }

    public function blogs(Request $request): JsonResponse
    {
        $query = Blog::query()->where('status', 'published')->latest();

        foreach (['category_id', 'author_id'] as $column) {
            if ($request->filled($column)) {
                $query->where($column, $request->string($column));
            }
        }

        if ($request->filled('category_slug')) {
            $categoryIds = Category::query()
                ->where('slug', $request->string('category_slug'))
                ->pluck('_id')
                ->map(fn ($id) => (string) $id);
            $query->whereIn('category_id', $categoryIds);
        }

        return $this->success($query->paginate(15));
    }

    public function blog(string $id): JsonResponse
    {
        $blog = Blog::query()->where('status', 'published')->findOrFail($id);
        $blog->increment('views');

        return $this->success($blog->fresh());
    }

    public function blogBySlug(string $slug): JsonResponse
    {
        $blog = Blog::query()->where('status', 'published')->where('slug', $slug)->firstOrFail();
        $blog->increment('views');

        return $this->success($blog->fresh());
    }

    public function comments(Request $request): JsonResponse
    {
        $request->validate(['blog_id' => ['required', 'string']]);

        $comments = Comment::query()
            ->where('blog_id', $request->string('blog_id'))
            ->latest()
            ->get();

        return $this->success($comments);
    }

    public function media(Request $request): JsonResponse
    {
        $query = Media::query()->latest();

        if ($request->filled('type')) {
            $query->where('type', $request->string('type'));
        }

        return $this->success($query->paginate(15));
    }

    public function mediaItem(string $id): JsonResponse
    {
        return $this->success(Media::query()->findOrFail($id));
    }

    public function publications(Request $request): JsonResponse
    {
        $query = Publication::query()->latest();

        if ($request->filled('publication_type')) {
            $query->where('publication_type', $request->string('publication_type'));
        }

        $publications = $query->paginate(15);
        $publications->setCollection(
            $publications->getCollection()->map(fn (Publication $publication) => $this->publicationPayload($publication))
        );

        return $this->success($publications);
    }

    public function publication(string $id): JsonResponse
    {
        return $this->success($this->publicationPayload(Publication::query()->findOrFail($id)));
    }

    private function categoryNavigationPayload(Category $category): array
    {
        return [
            'id' => (string) $category->getKey(),
            'name' => $category->name,
            'slug' => $category->slug,
            'path' => $category->path ?: '/category/'.$category->slug,
            'description' => $category->description,
        ];
    }

    private function countryPayload(Country $country): array
    {
        return [
            'id' => (string) $country->getKey(),
            'region_id' => $country->region_id,
            'name' => $country->name,
            'slug' => $country->slug,
            'flag' => $country->flag,
            'image' => $country->image,
            'image_url' => $this->publicMediaUrl($country->image),
            'description' => $country->description,
        ];
    }

    private function publicationPayload(Publication $publication): array
    {
        return [
            'id' => (string) $publication->getKey(),
            'author_id' => $publication->author_id,
            'title' => $publication->title,
            'description' => $publication->description,
            'publication_type' => $publication->publication_type,
            'image' => $publication->image,
            'image_url' => $this->publicMediaUrl($publication->image),
            'file_url' => $publication->file_url,
            'download_count' => $publication->download_count,
            'created_at' => $publication->created_at,
            'updated_at' => $publication->updated_at,
        ];
    }

}
