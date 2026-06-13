<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ManagesAdminResource;
use App\Models\Page;

class PageController extends ApiController
{
    use ManagesAdminResource;

    protected function resourceModel(): string
    {
        return Page::class;
    }

    protected function filterableColumns(): array
    {
        return ['parent_path', 'is_published'];
    }

    protected function storeRules(): array
    {
        return [
            'parent_path' => ['nullable', 'string', 'max:500'],
            'path' => ['required', 'string', 'max:500'],
            'slug' => ['nullable', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'content' => ['nullable', 'string'],
            'image' => ['nullable', 'string', 'max:500'],
            'category' => ['nullable', 'string', 'max:100'],
            'sort_order' => ['nullable', 'integer'],
            'is_published' => ['nullable', 'boolean'],
        ];
    }

    protected function updateRules(): array
    {
        return [
            'parent_path' => ['nullable', 'string', 'max:500'],
            'path' => ['sometimes', 'string', 'max:500'],
            'slug' => ['nullable', 'string', 'max:255'],
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'content' => ['nullable', 'string'],
            'image' => ['nullable', 'string', 'max:500'],
            'category' => ['nullable', 'string', 'max:100'],
            'sort_order' => ['nullable', 'integer'],
            'is_published' => ['nullable', 'boolean'],
        ];
    }
}
