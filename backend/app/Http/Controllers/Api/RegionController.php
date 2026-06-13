<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ManagesAdminResource;
use App\Models\Region;

class RegionController extends ApiController
{
    use ManagesAdminResource;

    protected function resourceModel(): string
    {
        return Region::class;
    }

    protected function storeRules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ];
    }

    protected function updateRules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ];
    }
}
