<?php

declare(strict_types=1);

namespace App\Modules\Booking\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class BookingServiceAdjustment extends Model
{
    use BelongsToTenant;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $table = 'booking_service_adjustments';

    protected $fillable = [
        'tenant_id',
        'booking_id',
        'booking_service_id',
        'action',
        'old_data',
        'new_data',
        'old_total',
        'new_total',
        'adjusted_by',
        'notes',
    ];

    protected static function booted(): void
    {
        static::creating(function (BookingServiceAdjustment $model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    protected function casts(): array
    {
        return [
            'id' => 'string',
            'old_data' => 'array',
            'new_data' => 'array',
            'old_total' => 'decimal:2',
            'new_total' => 'decimal:2',
        ];
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class, 'booking_id');
    }

    public function bookingService(): BelongsTo
    {
        return $this->belongsTo(BookingService::class, 'booking_service_id');
    }
}
