<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class ApiController extends Controller
{
    protected function success(mixed $data = null, string $message = 'OK', int $status = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $status);
    }

    protected function error(string $message, int $status = 400, mixed $errors = null): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $status);
    }

    protected function publicMediaUrl(?string $path): ?string
    {
        if (blank($path)) {
            return null;
        }

        $path = trim($path);

        if (Str::startsWith($path, ['data:', 'blob:'])) {
            return $path;
        }

        if (Str::startsWith($path, ['http://', 'https://'])) {
            return $path;
        }

        $normalized = Str::of($path)
            ->replaceStart('storage/app/public/', '')
            ->replaceStart('app/public/', '')
            ->replaceStart('public/', '')
            ->replaceStart('/storage/', '')
            ->replaceStart('storage/', '')
            ->replaceStart('/uploads/', 'uploads/')
            ->toString();

        return url('/api/public/uploads/'.ltrim($normalized, '/'));
    }
}
