<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ManagesAdminResource;
use App\Models\Media;

class MediaController extends ApiController
{
    use ManagesAdminResource;

    protected function resourceModel(): string
    {
        return Media::class;
    }

    protected function filterableColumns(): array
    {
        return ['type', 'author_id'];
    }

    protected function storeRules(): array
    {
        return [
            'author_id' => ['nullable', 'string'],
            'type' => ['required', 'string', 'max:80'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'thumbnail' => ['nullable', 'string', 'max:500'],
            'media_url' => ['nullable', 'string', 'max:500'],
            'duration' => ['nullable', 'string', 'max:50'],
        ];
    }

    protected function updateRules(): array
    {
        return [
            'author_id' => ['nullable', 'string'],
            'type' => ['sometimes', 'string', 'max:80'],
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'thumbnail' => ['nullable', 'string', 'max:500'],
            'media_url' => ['nullable', 'string', 'max:500'],
            'duration' => ['nullable', 'string', 'max:50'],
        ];
    }
}
