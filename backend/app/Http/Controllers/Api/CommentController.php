<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ManagesAdminResource;
use App\Models\Comment;

class CommentController extends ApiController
{
    use ManagesAdminResource;

    protected function resourceModel(): string
    {
        return Comment::class;
    }

    protected function filterableColumns(): array
    {
        return ['blog_id', 'user_id'];
    }

    protected function storeRules(): array
    {
        return [
            'blog_id' => ['required', 'string'],
            'user_id' => ['required', 'string'],
            'comment' => ['required', 'string'],
        ];
    }

    protected function updateRules(): array
    {
        return [
            'blog_id' => ['sometimes', 'string'],
            'user_id' => ['sometimes', 'string'],
            'comment' => ['sometimes', 'string'],
        ];
    }
}
