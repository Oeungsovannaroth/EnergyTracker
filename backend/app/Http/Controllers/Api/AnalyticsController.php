<?php

namespace App\Http\Controllers\Api;

use App\Services\AnalyticsService;
use Illuminate\Http\JsonResponse;

class AnalyticsController extends ApiController
{
    public function index(AnalyticsService $analytics): JsonResponse
    {
        return $this->success($analytics->dashboard());
    }
}
