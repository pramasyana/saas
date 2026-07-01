<?php

declare(strict_types=1);

namespace App\Modules\Company\Contracts;

use App\Modules\Company\Models\CompanyBranding;

interface CompanyBrandingRepositoryInterface
{
    public function findByTenantId(string $tenantId): ?CompanyBranding;

    public function updateOrCreate(string $tenantId, array $data): CompanyBranding;
}
