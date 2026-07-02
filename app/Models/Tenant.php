<?php

declare(strict_types=1);

namespace App\Models;

use App\Modules\Company\Models\Branch;
use App\Modules\Company\Models\CompanyBranding;
use App\Modules\Company\Models\CompanyProfile;
use App\Modules\Company\Models\Holiday;
use App\Modules\Company\Models\WorkingHour;
use App\Modules\Crm\Models\Customer;
use App\Modules\Crm\Models\MembershipTier;
use App\Modules\Crm\Models\Referral;
use App\Modules\Crm\Models\Review;
use App\Modules\Crm\Models\Reward;
use App\Modules\Crm\Models\Tag;
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

    public function customers(): HasMany
    {
        return $this->hasMany(Customer::class, 'tenant_id', 'id');
    }

    public function tags(): HasMany
    {
        return $this->hasMany(Tag::class, 'tenant_id', 'id');
    }

    public function membershipTiers(): HasMany
    {
        return $this->hasMany(MembershipTier::class, 'tenant_id', 'id');
    }

    public function rewards(): HasMany
    {
        return $this->hasMany(Reward::class, 'tenant_id', 'id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class, 'tenant_id', 'id');
    }

    public function referrals(): HasMany
    {
        return $this->hasMany(Referral::class, 'tenant_id', 'id');
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
