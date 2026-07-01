<?php

declare(strict_types=1);

namespace App\Modules\Company\Events;

use App\Modules\Company\Models\CompanyProfile;
use Illuminate\Foundation\Events\Dispatchable;

class CompanyProfileUpdated
{
    use Dispatchable;

    public function __construct(
        public readonly string $tenantId,
        public readonly CompanyProfile $profile,
    ) {}
}
