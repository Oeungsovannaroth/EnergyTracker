<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ManagesAdminResource;
use App\Models\Category;
use Illuminate\Support\Str;

class CategoryController extends ApiController
{
    use ManagesAdminResource;

    protected function resourceModel(): string
    {
        return Category::class;
    }

    protected function filterableColumns(): array
    {
        return ['type', 'parent_id'];
    }

    protected function storeRules(): array
    {
        return [
            'parent_id' => ['nullable', 'string'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'type' => ['required', 'string', 'max:80'],
            'path' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer'],
            'is_published' => ['nullable', 'boolean'],
        ];
    }

    protected function updateRules(): array
    {
        return [
            'parent_id' => ['nullable', 'string'],
            'name' => ['sometimes', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'type' => ['sometimes', 'string', 'max:80'],
            'path' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer'],
            'is_published' => ['nullable', 'boolean'],
        ];
    }

    public function store(\Illuminate\Http\Request $request): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate($this->storeRules());
        $validated = $this->normalizeCategoryPayload($validated);
        $item = Category::create($validated);

        return $this->success($item, 'Created.', 201);
    }

    public function update(\Illuminate\Http\Request $request): \Illuminate\Http\JsonResponse
    {
        $item = $this->findResource($this->routeResourceId($request));
        $validated = $request->validate($this->updateRules());
        $validated = $this->normalizeCategoryPayload($validated, $item->slug);
        $item->update($validated);

        return $this->success($item->fresh(), 'Updated.');
    }

    private function normalizeCategoryPayload(array $payload, ?string $fallbackSlug = null): array
    {
        if (empty($payload['slug']) && ! empty($payload['name'])) {
            $payload['slug'] = Str::slug($payload['name']);
        }

        $slug = $payload['slug'] ?? $fallbackSlug;

        if (($payload['type'] ?? null) === 'nav' && empty($payload['path']) && $slug) {
            $payload['path'] = '/category/'.$slug;
        }

        return $payload;
    }
}
