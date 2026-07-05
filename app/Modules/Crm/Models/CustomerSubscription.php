<?php

declare(strict_types=1);

namespace App\Modules\Crm\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class CustomerSubscription extends Model
{
    use BelongsToTenant;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'tenant_id',
        'customer_id',
        'plan_id',
        'plan_name',
        'price_amount',
        'billing_interval',
        'benefits_snapshot',
        'status',
        'start_date',
        'end_date',
        'cancelled_at',
    ];

    protected static function booted(): void
    {
        static::creating(function (CustomerSubscription $model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    protected function casts(): array
    {
        return [
            'id' => 'string',
            'price_amount' => 'decimal:2',
            'benefits_snapshot' => 'array',
            'start_date' => 'datetime',
            'end_date' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(CustomerMembershipPlan::class, 'plan_id');
    }
}
