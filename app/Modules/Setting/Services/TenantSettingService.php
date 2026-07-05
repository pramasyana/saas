<?php

declare(strict_types=1);

namespace App\Modules\Setting\Services;

use App\Modules\Setting\Models\TenantSetting;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class TenantSettingService
{
    private ?Collection $all = null;

    public function get(string $key, mixed $default = null): mixed
    {
        $settings = $this->all();

        $row = $settings->firstWhere('key', $key);
        if (! $row) {
            return $default;
        }

        return $this->cast($row->value, $row->type);
    }

    public function set(string $key, mixed $value, ?string $type = null, ?string $group = null): void
    {
        $tenantId = tenant()->getTenantKey();

        $row = TenantSetting::where('tenant_id', $tenantId)->where('key', $key)->first();

        $data = [
            'value' => is_array($value) ? json_encode($value) : (string) $value,
            'type' => $type ?? $this->inferType($value),
            'group' => $group,
        ];

        if ($row) {
            $row->update($data);
        } else {
            TenantSetting::create(array_merge($data, [
                'key' => $key,
                'tenant_id' => $tenantId,
            ]));
        }

        $this->flush();
    }

    public function getGroup(string $group): Collection
    {
        return $this->all()->where('group', $group)->values();
    }

    public function all(): Collection
    {
        if ($this->all !== null) {
            return $this->all;
        }

        $tenantId = tenant()->getTenantKey();

        $data = Cache::remember("tenant_settings:{$tenantId}", 3600, function () use ($tenantId) {
            return TenantSetting::where('tenant_id', $tenantId)
                ->get(['key', 'value', 'type', 'group'])
                ->toArray();
        });

        if (! is_array($data)) {
            Cache::forget("tenant_settings:{$tenantId}");
            $data = TenantSetting::where('tenant_id', $tenantId)
                ->get(['key', 'value', 'type', 'group'])
                ->toArray();
        }

        $this->all = collect($data)->map(fn ($item) => (object) $item);

        return $this->all;
    }

    public function flush(): void
    {
        $this->all = null;
        Cache::forget('tenant_settings:' . tenant()->getTenantKey());
    }

    private function cast(string $value, string $type): mixed
    {
        return match ($type) {
            'integer' => (int) $value,
            'boolean' => filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false,
            'json' => json_decode($value, true) ?? [],
            default => $value,
        };
    }

    private function inferType(mixed $value): string
    {
        if (is_bool($value)) {
            return 'boolean';
        }
        if (is_int($value)) {
            return 'integer';
        }
        if (is_array($value)) {
            return 'json';
        }
        return 'string';
    }
}
