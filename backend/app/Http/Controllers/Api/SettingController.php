<?php

namespace App\Http\Controllers\Api;

use App\Models\SystemSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends ApiController
{
    public function index(): JsonResponse
    {
        return $this->success(SystemSetting::orderBy('group')->orderBy('key')->get());
    }

    public function upsert(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'key' => ['required', 'string', 'max:120'],
            'value' => ['nullable'],
            'group' => ['required', 'string', 'max:80'],
            'is_secret' => ['boolean'],
        ]);

        $setting = SystemSetting::updateOrCreate(
            ['key' => $validated['key']],
            $validated,
        );

        return $this->success($setting, 'Setting saved.');
    }
}
