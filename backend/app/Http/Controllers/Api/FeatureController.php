<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ManagesAdminResource;
use App\Models\Feature;

class FeatureController extends ApiController
{
    use ManagesAdminResource;

    protected function resourceModel(): string
    {
        return Feature::class;
    }

    protected function filterableColumns(): array
    {
        return ['article_id'];
    }

    protected function storeRules(): array
    {
        return [
            'article_id' => ['required', 'string'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'string', 'max:500'],
        ];
    }

    protected function updateRules(): array
    {
        return [
            'article_id' => ['sometimes', 'string'],
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'string', 'max:500'],
        ];
    }
}
