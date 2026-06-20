<?php

namespace App\Http\Controllers\Api;

use App\Models\ContentItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContentController extends ApiController
{
    private const CONTENT_TYPES = 'product,blog,featured,renewable-energy,fossil-fuel';

    public function index(Request $request): JsonResponse
    {
        $query = ContentItem::query()->orderBy('sort_order')->latest();

        if ($request->filled('type')) {
            $query->where('type', (string) $request->input('type'));
        }

        return $this->success($query->paginate(15));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => ['required', 'in:'.self::CONTENT_TYPES],
            'title' => ['required', 'string', 'max:255'],
            'desc' => ['nullable', 'string'],
            'category_id' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:100'],
            'image' => ['nullable', 'string', 'max:500'],
            'link' => ['nullable', 'string', 'max:500'],
            'sort_order' => ['nullable', 'integer'],
            'is_published' => ['nullable', 'boolean'],
            'meta' => ['nullable', 'array'],
            'meta.price' => ['nullable', 'numeric', 'min:0'],
            'meta.currency' => ['nullable', 'string', 'max:10'],
            'meta.features' => ['nullable', 'array'],
            'meta.specs' => ['nullable', 'array'],
        ]);

        $item = ContentItem::create($validated);

        return $this->success($item, 'Content created.', 201);
    }

    public function update(Request $request, ContentItem $content): JsonResponse
    {
        $validated = $request->validate([
            'type' => ['sometimes', 'in:'.self::CONTENT_TYPES],
            'title' => ['sometimes', 'string', 'max:255'],
            'desc' => ['nullable', 'string'],
            'category_id' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:100'],
            'image' => ['nullable', 'string', 'max:500'],
            'link' => ['nullable', 'string', 'max:500'],
            'sort_order' => ['nullable', 'integer'],
            'is_published' => ['nullable', 'boolean'],
            'meta' => ['nullable', 'array'],
            'meta.price' => ['nullable', 'numeric', 'min:0'],
            'meta.currency' => ['nullable', 'string', 'max:10'],
            'meta.features' => ['nullable', 'array'],
            'meta.specs' => ['nullable', 'array'],
        ]);

        $content->update($validated);

        return $this->success($content->fresh(), 'Content updated.');
    }

    public function destroy(ContentItem $content): JsonResponse
    {
        $content->delete();

        return $this->success(null, 'Content deleted.');
    }
}
