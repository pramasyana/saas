<?php

declare(strict_types=1);

namespace App\Models;

use App\Modules\Company\Models\Branch;
use App\Modules\Company\Models\CompanyBranding;
use App\Modules\Company\Models\CompanyProfile;
use App\Modules\Company\Models\Holiday;
use App\Modules\Company\Models\WorkingHour;
use App\Modules\Subscription\Models\Subscription;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Stancl\Tenancy\Contracts\TenantWithDatabase;
use Stancl\Tenancy\Database\Concerns\HasDatabase;
use Stancl\Tenancy\Database\Concerns\HasDomains;
use Stancl\Tenancy\Database\Models\Tenant as BaseTenant;

class Tenant extends BaseTenant implements TenantWithDatabase
{
    use HasDatabase, HasDomains;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    public function companyProfile(): HasOne
    {
        return $this->hasOne(CompanyProfile::class, 'tenant_id', 'id');
    }

    public function companyBranding(): HasOne
    {
        return $this->hasOne(CompanyBranding::class, 'tenant_id', 'id');
    }

    public function branches(): HasMany
    {
        return $this->hasMany(Branch::class, 'tenant_id', 'id');
    }

    public function workingHours(): HasMany
    {
        return $this->hasMany(WorkingHour::class, 'tenant_id', 'id');
    }

    public function holidays(): HasMany
    {
        return $this->hasMany(Holiday::class, 'tenant_id', 'id');
    }

    public function getCompanyNameAttribute(): ?string
    {
        return $this->getInternal('name');
    }

    public function getCompanyEmailAttribute(): ?string
    {
        return $this->getInternal('email');
    }

    public function getCompanyPhoneAttribute(): ?string
    {
        return $this->getInternal('phone');
    }
}
