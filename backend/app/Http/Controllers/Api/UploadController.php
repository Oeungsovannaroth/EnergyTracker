<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends ApiController
{
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'image', 'mimes:jpg,jpeg,png,gif,webp', 'max:5120'],
        ]);

        $file = $request->file('file');
        $filename = Str::uuid().'.'.$file->getClientOriginalExtension();
        $path = $file->storeAs('uploads', $filename, 'public');

        $publicPath = '/storage/'.$path;

        return $this->success([
            'path' => $publicPath,
            'url' => $this->publicMediaUrl($publicPath),
            'name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
        ], 'Image uploaded.', 201);
    }

    public function show(string $path): Response
    {
        $normalized = ltrim($path, '/');

        abort_unless(Str::startsWith($normalized, 'uploads/'), 404);
        abort_unless(Storage::disk('public')->exists($normalized), 404);

        return response(Storage::disk('public')->get($normalized), 200, [
            'Content-Type' => Storage::disk('public')->mimeType($normalized) ?: 'application/octet-stream',
            'Cache-Control' => 'public, max-age=31536000',
        ]);
    }
}
