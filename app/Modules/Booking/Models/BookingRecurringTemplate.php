<?php

declare(strict_types=1);

namespace App\Modules\Booking\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class BookingRecurringTemplate extends Model
{
    use BelongsToTenant, SoftDeletes;

    protected $table = 'booking_recurring_templates';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'tenant_id',
        'source_booking_id',
        'frequency',
        'interval',
        'days_of_week',
        'end_type',
        'count',
        'occurrences_generated',
        'until_date',
        'next_generation_date',
        'is_active',
    ];

    protected static function booted(): void
    {
        static::creating(function (BookingRecurringTemplate $model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    protected function casts(): array
    {
        return [
            'id' => 'string',
            'days_of_week' => 'array',
            'interval' => 'integer',
            'count' => 'integer',
            'occurrences_generated' => 'integer',
            'next_generation_date' => 'date',
            'until_date' => 'date',
            'is_active' => 'boolean',
        ];
    }

    public function sourceBooking(): BelongsTo
    {
        return $this->belongsTo(Booking::class, 'source_booking_id');
    }
}
