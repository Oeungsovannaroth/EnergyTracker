<?php

namespace App\Http\Controllers\Api\Concerns;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

trait ManagesAdminResource
{
    abstract protected function resourceModel(): string;

  abstract protected function storeRules(): array;

    abstract protected function updateRules(): array;

    public function index(Request $request): JsonResponse
    {
        $query = $this->resourceModel()::query()->latest();

        foreach ($this->indexFilters($request) as $column => $value) {
            $query->where($column, $value);
        }

        return $this->success($query->paginate((int) $request->input('per_page', 15)));
    }

    public function show(Request $request): JsonResponse
    {
        return $this->success($this->findResource($this->routeResourceId($request)));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate($this->storeRules());
        $item = $this->resourceModel()::create($validated);

        return $this->success($item, 'Created.', 201);
    }

    public function update(Request $request): JsonResponse
    {
        $item = $this->findResource($this->routeResourceId($request));
        $validated = $request->validate($this->updateRules());
        $item->update($validated);

        return $this->success($item->fresh(), 'Updated.');
    }

    public function destroy(Request $request): JsonResponse
    {
        $this->findResource($this->routeResourceId($request))->delete();

        return $this->success(null, 'Deleted.');
    }

    protected function indexFilters(Request $request): array
    {
        return array_filter($request->only($this->filterableColumns()), fn ($value) => $value !== null && $value !== '');
    }

    protected function filterableColumns(): array
    {
        return [];
    }

    protected function findResource(string $id): Model
    {
        return $this->resourceModel()::query()->findOrFail($id);
    }

    protected function routeResourceId(Request $request): string
    {
        $parameter = collect($request->route()->parameters())->first();

        if ($parameter instanceof Model) {
            return (string) $parameter->getKey();
        }

        return (string) $parameter;
    }
}
