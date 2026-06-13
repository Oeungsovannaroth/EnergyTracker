<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ManagesAdminResource;
use App\Models\Publication;

class PublicationController extends ApiController
{
    use ManagesAdminResource;

    protected function resourceModel(): string
    {
        return Publication::class;
    }

    protected function filterableColumns(): array
    {
        return ['author_id', 'publication_type'];
    }

    protected function storeRules(): array
    {
        return [
            'author_id' => ['nullable', 'string'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'publication_type' => ['nullable', 'string', 'max:80'],
            'file_url' => ['nullable', 'string', 'max:500'],
            'download_count' => ['nullable', 'integer', 'min:0'],
        ];
    }

    protected function updateRules(): array
    {
        return [
            'author_id' => ['nullable', 'string'],
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'publication_type' => ['nullable', 'string', 'max:80'],
            'file_url' => ['nullable', 'string', 'max:500'],
            'download_count' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
