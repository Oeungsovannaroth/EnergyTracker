<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_read_profile_and_logout(): void
    {
        $registerResponse = $this->postJson('/api/auth/register', [
            'name' => 'Solar Admin',
            'email' => 'admin@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $registerResponse
            ->assertCreated()
            ->assertJsonPath('data.user.email', 'admin@example.com')
            ->assertJsonStructure([
                'data' => [
                    'access_token',
                    'token_type',
                    'user' => ['id', 'name', 'email', 'created_at', 'updated_at'],
                ],
            ]);

        $token = $registerResponse->json('data.access_token');

        $this->withToken($token)
            ->getJson('/api/auth/me')
            ->assertOk()
            ->assertJsonPath('data.email', 'admin@example.com');

        $this->withToken($token)
            ->postJson('/api/auth/logout')
            ->assertOk();

        $this->withToken($token)
            ->getJson('/api/auth/me')
            ->assertUnauthorized();
    }
}
