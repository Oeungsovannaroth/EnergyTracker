<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ManagesAdminResource;
use App\Models\Spotlight;

class SpotlightController extends ApiController
{
    use ManagesAdminResource;

    protected function resourceModel(): string
    {
        return Spotlight::class;
    }

    protected function filterableColumns(): array
    {
        return ['country_id'];
    }

    protected function storeRules(): array
    {
        return [
            'country_id' => ['required', 'string'],
            'title' => ['required', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
            'thumbnail' => ['nullable', 'string', 'max:500'],
            'status' => ['nullable', 'boolean'],
        ];
    }

    protected function updateRules(): array
    {
        return [
            'country_id' => ['sometimes', 'string'],
            'title' => ['sometimes', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
            'thumbnail' => ['nullable', 'string', 'max:500'],
            'status' => ['nullable', 'boolean'],
        ];
    }
}
