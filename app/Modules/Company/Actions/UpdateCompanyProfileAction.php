<?php

declare(strict_types=1);

namespace App\Modules\Company\Actions;

use App\Modules\Company\Contracts\CompanyProfileRepositoryInterface;
use App\Modules\Company\Events\CompanyProfileUpdated;
use App\Modules\Company\Models\CompanyProfile;

class UpdateCompanyProfileAction
{
    public function __construct(
        private readonly CompanyProfileRepositoryInterface $companyProfileRepository,
    ) {}

    public function execute(string $tenantId, array $data): CompanyProfile
    {
        $profile = $this->companyProfileRepository->updateOrCreate($tenantId, $data);

        CompanyProfileUpdated::dispatch($tenantId, $profile);

        return $profile;
    }
}
