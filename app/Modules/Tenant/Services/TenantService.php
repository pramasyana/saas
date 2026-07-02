<?php

declare(strict_types=1);

namespace App\Modules\Tenant\Services;

use App\Models\CentralSetting;
use App\Models\Tenant;
use App\Modules\Tenant\Contracts\TenantRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use RuntimeException;

class TenantService
{
    public function __construct(
        private readonly TenantRepositoryInterface $tenantRepository,
    ) {}

    public function paginate(array $filters = [], int $perPage = 15): mixed
    {
        return $this->tenantRepository->paginate($filters, $perPage);
    }

    public function findById(string $id): Tenant
    {
        $tenant = $this->tenantRepository->findById($id);

        if (! $tenant) {
            throw new RuntimeException('Tenant tidak ditemukan.');
        }

        return $tenant;
    }

    public function create(array $data): Tenant
    {
        return DB::transaction(function () use ($data) {
            $tenant = $this->tenantRepository->create([
                'user_id' => $data['user_id'] ?? null,
            ]);

            $tenant->setInternal('name', $data['name']);
            $tenant->setInternal('email', $data['email'] ?? null);
            $tenant->setInternal('phone', $data['phone'] ?? null);
            $tenant->save();

            if (! empty($data['domain'])) {
                $tenant->domains()->create([
                    'domain' => $data['domain'],
                ]);
            } else {
                $slug = Str::slug($data['name']);
                $baseDomain = CentralSetting::get('base_domain', config('app.domain', 'localhost'));

                $tenant->domains()->create([
                    'domain' => $slug.'.'.$baseDomain,
                ]);
            }

            Log::info('Tenant created via admin', [
                'tenant_id' => $tenant->id,
                'name' => $data['name'],
            ]);

            return $tenant->fresh();
        });
    }

    public function update(string $id, array $data): Tenant
    {
        return DB::transaction(function () use ($id, $data) {
            $tenant = $this->findById($id);

            if (isset($data['name'])) {
                $tenant->setInternal('name', $data['name']);
            }
            if (isset($data['email'])) {
                $tenant->setInternal('email', $data['email']);
            }
            if (isset($data['phone'])) {
                $tenant->setInternal('phone', $data['phone']);
            }

            $tenant->save();

            if (! empty($data['domain'])) {
                $tenant->domains()->updateOrCreate(
                    [],
                    ['domain' => $data['domain']],
                );
            }

            Log::info('Tenant updated', [
                'tenant_id' => $tenant->id,
            ]);

            return $tenant->fresh();
        });
    }

    public function delete(string $id): void
    {
        DB::transaction(function () use ($id) {
            $tenant = $this->findById($id);

            $tenant->domains()->delete();

            $this->tenantRepository->delete($tenant);

            Log::info('Tenant deleted', [
                'tenant_id' => $id,
            ]);
        });
    }
}
