<?php

declare(strict_types=1);

namespace App\Modules\Company\Repositories;

use App\Modules\Company\Contracts\CompanyProfileRepositoryInterface;
use App\Modules\Company\Models\CompanyProfile;

class CompanyProfileRepository implements CompanyProfileRepositoryInterface
{
    public function findByTenantId(string $tenantId): ?CompanyProfile
    {
        return CompanyProfile::where('tenant_id', $tenantId)->first();
    }

    public function updateOrCreate(string $tenantId, array $data): CompanyProfile
    {
        return CompanyProfile::updateOrCreate(
            ['tenant_id' => $tenantId],
            $data,
        );
    }
}
