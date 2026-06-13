<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends ApiController
{
    public function index(): JsonResponse
    {
        return $this->success(User::latest()->paginate(10));
    }

    public function show(User $user): JsonResponse
    {
        return $this->success($user);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'min:8'],
            'role' => ['required', 'in:admin,user'],
            'status' => ['required', 'in:active,invited,suspended'],
            'avatar' => ['nullable', 'string', 'max:500'],
        ]);

        return $this->success(User::create($validated), 'User created.', 201);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'unique:users,email,'.$user->getKey().',_id'],
            'password' => ['sometimes', 'min:8'],
            'role' => ['sometimes', 'in:admin,user'],
            'status' => ['sometimes', 'in:active,invited,suspended'],
            'company' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'avatar' => ['nullable', 'string', 'max:500'],
        ]);

        $user->update($validated);

        return $this->success($user->fresh(), 'User updated.');
    }

    public function destroy(User $user): JsonResponse
    {
        $user->delete();

        return $this->success(null, 'User deleted.');
    }
}
