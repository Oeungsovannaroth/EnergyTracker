<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ManagesAdminResource;
use App\Models\Bookmark;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookmarkController extends ApiController
{
    use ManagesAdminResource;

    protected function resourceModel(): string
    {
        return Bookmark::class;
    }

    protected function filterableColumns(): array
    {
        return ['user_id', 'article_id'];
    }

    protected function storeRules(): array
    {
        return [
            'user_id' => ['required', 'string'],
            'article_id' => ['required', 'string'],
        ];
    }

    protected function updateRules(): array
    {
        return [
            'user_id' => ['sometimes', 'string'],
            'article_id' => ['sometimes', 'string'],
        ];
    }

    public function mine(Request $request): JsonResponse
    {
        $bookmarks = Bookmark::query()
            ->where('user_id', (string) $request->user()->getKey())
            ->latest()
            ->paginate(15);

        return $this->success($bookmarks);
    }

    public function destroy(Request $request): JsonResponse
    {
        $bookmark = Bookmark::query()->findOrFail($this->routeResourceId($request));

        if ($request->user()->role !== 'admin' && (string) $bookmark->user_id !== (string) $request->user()->getKey()) {
            return $this->error('Forbidden.', 403);
        }

        $bookmark->delete();

        return $this->success(null, 'Deleted.');
    }
}
