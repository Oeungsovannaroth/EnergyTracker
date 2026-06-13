<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends ApiController
{
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'max:10240', 'mimes:jpg,jpeg,png,gif,webp,pdf,mp4,webm'],
        ]);

        $file = $request->file('file');
        $filename = Str::uuid().'.'.$file->getClientOriginalExtension();
        $path = $file->storeAs('uploads', $filename, 'public');

        $publicPath = '/storage/'.$path;

        return $this->success([
            'path' => $publicPath,
            'url' => $request->getSchemeAndHttpHost().$publicPath,
        ], 'File uploaded.', 201);
    }
}
