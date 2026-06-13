<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ManagesAdminResource;
use App\Models\Category;

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
        ];
    }

    protected function updateRules(): array
    {
        return [
            'parent_id' => ['nullable', 'string'],
            'name' => ['sometimes', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'type' => ['sometimes', 'string', 'max:80'],
        ];
    }
}
