<?php

declare(strict_types=1);

namespace App\Modules\Company\Repositories;

use App\Modules\Company\Contracts\CompanyBrandingRepositoryInterface;
use App\Modules\Company\Models\CompanyBranding;

class CompanyBrandingRepository implements CompanyBrandingRepositoryInterface
{
    public function findByTenantId(string $tenantId): ?CompanyBranding
    {
        return CompanyBranding::where('tenant_id', $tenantId)->first();
    }

    public function updateOrCreate(string $tenantId, array $data): CompanyBranding
    {
        return CompanyBranding::updateOrCreate(
            ['tenant_id' => $tenantId],
            $data,
        );
    }
}
