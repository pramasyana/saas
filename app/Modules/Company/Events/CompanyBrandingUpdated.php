<?php

declare(strict_types=1);

namespace App\Modules\Company\Events;

use App\Modules\Company\Models\CompanyBranding;
use Illuminate\Foundation\Events\Dispatchable;

class CompanyBrandingUpdated
{
    use Dispatchable;

    public function __construct(
        public readonly string $tenantId,
        public readonly CompanyBranding $branding,
    ) {}
}
