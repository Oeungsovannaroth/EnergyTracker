<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;

class AuthController extends ApiController
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', 'min:8'],
            'company' => ['nullable', 'string', 'max:255'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'company' => $validated['company'] ?? null,
            'role' => 'user',
            'status' => 'active',
        ]);

        $token = auth('api')->login($user);

        return $this->success($this->tokenPayload($token), 'Account created.', 201);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! $token = auth('api')->attempt($credentials)) {
            return $this->error('The provided credentials are incorrect.', 401);
        }

        return $this->success($this->tokenPayload($token), 'Logged in.');
    }

    public function me(): JsonResponse
    {
        return $this->success($this->userPayload(auth('api')->user()));
    }

    public function logout(): JsonResponse
    {
        auth('api')->logout();

        return $this->success(null, 'Logged out.');
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['email' => ['required', 'email']]);

        $status = Password::sendResetLink($request->only('email'));

        return $status === Password::RESET_LINK_SENT
            ? $this->success(null, __($status))
            : $this->error(__($status), 422);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'token' => ['required'],
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $status = Password::reset($validated, function (User $user, string $password) {
            $user->password = $password;
            $user->save();
        });

        return $status === Password::PASSWORD_RESET
            ? $this->success(null, __($status))
            : $this->error(__($status), 422);
    }

    private function tokenPayload(string $token): array
    {
        return [
            'access_token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => $this->userPayload(auth('api')->user()),
        ];
    }

    private function userPayload(?User $user): ?array
    {
        if (! $user) {
            return null;
        }

        return [
            'id' => (string) $user->getKey(),
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'status' => $user->status,
            'company' => $user->company,
            'phone' => $user->phone,
            'avatar' => $user->avatar ?? $user->avatar_url,
            'avatar_url' => $user->avatar_url ?? $user->avatar,
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ];
    }
}
