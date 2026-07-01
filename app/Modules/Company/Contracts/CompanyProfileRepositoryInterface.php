<?php

declare(strict_types=1);

namespace App\Modules\Company\Contracts;

use App\Modules\Company\Models\CompanyProfile;

interface CompanyProfileRepositoryInterface
{
    public function findByTenantId(string $tenantId): ?CompanyProfile;

    public function updateOrCreate(string $tenantId, array $data): CompanyProfile;
}
