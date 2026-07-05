<?php

declare(strict_types=1);

namespace App\Modules\Setting\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Setting\Services\TenantSettingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TenantSettingController extends Controller
{
    public function __construct(
        private readonly TenantSettingService $settings,
    ) {}

    public function index(): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => $this->settings->all()->map(fn ($s) => [
                'key' => $s->key,
                'value' => $this->settings->get($s->key),
                'type' => $s->type,
                'group' => $s->group,
            ]),
        ]);
    }

    public function group(string $group): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => $this->settings->getGroup($group)->map(fn ($s) => [
                'key' => $s->key,
                'value' => $this->settings->get($s->key),
                'type' => $s->type,
                'group' => $s->group,
            ]),
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable',
            'settings.*.type' => 'nullable|string',
            'settings.*.group' => 'nullable|string',
        ]);

        foreach ($validated['settings'] as $item) {
            $this->settings->set(
                $item['key'],
                $item['value'],
                $item['type'] ?? null,
                $item['group'] ?? null,
            );
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Settings updated successfully.',
        ]);
    }
}
