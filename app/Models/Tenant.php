<?php

declare(strict_types=1);

namespace App\Models;

use App\Modules\Subscription\Models\Subscription;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
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
