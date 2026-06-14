<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ManagesAdminResource;
use App\Models\Country;

class CountryController extends ApiController
{
    use ManagesAdminResource;

    protected function resourceModel(): string
    {
        return Country::class;
    }

    protected function filterableColumns(): array
    {
        return ['region_id'];
    }

    protected function storeRules(): array
    {
        return [
            'region_id' => ['required', 'string'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'flag' => ['nullable', 'string', 'max:500'],
            'image' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
        ];
    }

    protected function updateRules(): array
    {
        return [
            'region_id' => ['sometimes', 'string'],
            'name' => ['sometimes', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'flag' => ['nullable', 'string', 'max:500'],
            'image' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
        ];
    }
}
