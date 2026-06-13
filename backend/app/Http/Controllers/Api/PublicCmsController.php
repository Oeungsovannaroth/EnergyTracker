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
        ]);

        $query = Page::query()
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->latest();

        if (! empty($validated['parent_path'])) {
            $query->where('parent_path', $validated['parent_path']);
        }

        return $this->success($query->get());
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

        return $this->success($query->get());
    }

    public function country(string $id): JsonResponse
    {
        return $this->success(Country::query()->findOrFail($id));
    }

    public function countryBySlug(string $slug): JsonResponse
    {
        return $this->success(Country::query()->where('slug', $slug)->firstOrFail());
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

        return $this->success($query->paginate(15));
    }

    public function publication(string $id): JsonResponse
    {
        return $this->success(Publication::query()->findOrFail($id));
    }

}
