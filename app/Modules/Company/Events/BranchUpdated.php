<?php

declare(strict_types=1);

namespace App\Modules\Company\Events;

use App\Modules\Company\Models\Branch;
use Illuminate\Foundation\Events\Dispatchable;

class BranchUpdated
{
    use Dispatchable;

    public function __construct(
        public readonly string $tenantId,
        public readonly Branch $branch,
    ) {}
}
