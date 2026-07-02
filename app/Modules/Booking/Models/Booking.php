<?php

declare(strict_types=1);

namespace App\Modules\Booking\Models;

use App\Modules\Crm\Models\Customer;
use App\Modules\Company\Models\Branch;
use App\Modules\Staff\Models\Staff;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class Booking extends Model
{
    use BelongsToTenant, SoftDeletes;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'tenant_id',
        'branch_id',
        'customer_id',
        'staff_id',
        'start_time',
        'end_time',
        'duration_minutes',
        'status',
        'source',
        'notes',
    ];

    protected static function booted(): void
    {
        static::creating(function (Booking $model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    protected function casts(): array
    {
        return [
            'id' => 'string',
            'start_time' => 'datetime',
            'end_time' => 'datetime',
            'duration_minutes' => 'integer',
        ];
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class, 'branch_id');
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function staff(): BelongsTo
    {
        return $this->belongsTo(Staff::class, 'staff_id');
    }

    public function services(): HasMany
    {
        return $this->hasMany(BookingService::class, 'booking_id');
    }

    public function statusLogs(): HasMany
    {
        return $this->hasMany(BookingStatusLog::class, 'booking_id');
    }

    public function reminders(): HasMany
    {
        return $this->hasMany(BookingReminder::class, 'booking_id');
    }
}
