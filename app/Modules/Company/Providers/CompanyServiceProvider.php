<?php

declare(strict_types=1);

namespace App\Modules\Company\Providers;

use App\Modules\Company\Contracts\BranchRepositoryInterface;
use App\Modules\Company\Contracts\CompanyBrandingRepositoryInterface;
use App\Modules\Company\Contracts\CompanyProfileRepositoryInterface;
use App\Modules\Company\Contracts\HolidayRepositoryInterface;
use App\Modules\Company\Contracts\WorkingHourRepositoryInterface;
use App\Modules\Company\Events\BranchCreated;
use App\Modules\Company\Events\BranchDeleted;
use App\Modules\Company\Events\BranchUpdated;
use App\Modules\Company\Events\CompanyBrandingUpdated;
use App\Modules\Company\Events\CompanyProfileUpdated;
use App\Modules\Company\Listeners\ClearCompanyCache;
use App\Modules\Company\Models\Branch;
use App\Modules\Company\Models\CompanyBranding;
use App\Modules\Company\Models\CompanyProfile;
use App\Modules\Company\Models\Holiday;
use App\Modules\Company\Policies\BranchPolicy;
use App\Modules\Company\Policies\CompanyPolicy;
use App\Modules\Company\Policies\HolidayPolicy;
use App\Modules\Company\Repositories\BranchRepository;
use App\Modules\Company\Repositories\CompanyBrandingRepository;
use App\Modules\Company\Repositories\CompanyProfileRepository;
use App\Modules\Company\Repositories\HolidayRepository;
use App\Modules\Company\Repositories\WorkingHourRepository;
use Illuminate\Foundation\Support\Providers\EventServiceProvider;
use Illuminate\Support\Facades\Gate;

class CompanyServiceProvider extends EventServiceProvider
{
    /** @var array<class-string, array<class-string>> */
    protected $listen = [
        CompanyProfileUpdated::class => [ClearCompanyCache::class],
        CompanyBrandingUpdated::class => [ClearCompanyCache::class],
        BranchCreated::class => [ClearCompanyCache::class],
        BranchUpdated::class => [ClearCompanyCache::class],
        BranchDeleted::class => [ClearCompanyCache::class],
    ];

    public function register(): void
    {
        $this->app->bind(CompanyProfileRepositoryInterface::class, CompanyProfileRepository::class);
        $this->app->bind(CompanyBrandingRepositoryInterface::class, CompanyBrandingRepository::class);
        $this->app->bind(BranchRepositoryInterface::class, BranchRepository::class);
        $this->app->bind(WorkingHourRepositoryInterface::class, WorkingHourRepository::class);
        $this->app->bind(HolidayRepositoryInterface::class, HolidayRepository::class);
    }

    public function boot(): void
    {
        parent::boot();

        Gate::policy(CompanyProfile::class, CompanyPolicy::class);
        Gate::policy(CompanyBranding::class, CompanyPolicy::class);
        Gate::policy(Branch::class, BranchPolicy::class);
        Gate::policy(Holiday::class, HolidayPolicy::class);
    }
}
