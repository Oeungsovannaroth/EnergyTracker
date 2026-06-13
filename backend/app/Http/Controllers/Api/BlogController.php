<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ManagesAdminResource;
use App\Models\Blog;

class BlogController extends ApiController
{
    use ManagesAdminResource;

    protected function resourceModel(): string
    {
        return Blog::class;
    }

    protected function filterableColumns(): array
    {
        return ['category_id', 'author_id', 'status'];
    }

    protected function storeRules(): array
    {
        return [
            'category_id' => ['nullable', 'string'],
            'author_id' => ['nullable', 'string'],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
            'thumbnail' => ['nullable', 'string', 'max:500'],
            'views' => ['nullable', 'integer', 'min:0'],
            'status' => ['nullable', 'in:draft,published,archived'],
        ];
    }

    protected function updateRules(): array
    {
        return [
            'category_id' => ['nullable', 'string'],
            'author_id' => ['nullable', 'string'],
            'title' => ['sometimes', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
            'thumbnail' => ['nullable', 'string', 'max:500'],
            'views' => ['nullable', 'integer', 'min:0'],
            'status' => ['nullable', 'in:draft,published,archived'],
        ];
    }
}
