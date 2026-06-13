<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends ApiController
{
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'avatar_url' => ['nullable', 'url'],
        ]);

        $user = $request->user();
        $user->update($validated);

        return $this->success($user->fresh(), 'Profile updated.');
    }
}
