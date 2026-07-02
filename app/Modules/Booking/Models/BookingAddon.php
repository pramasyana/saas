<?php

declare(strict_types=1);

namespace App\Modules\Booking\Models;

use App\Modules\Service\Models\Addon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class BookingAddon extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $table = 'booking_addons';

    protected $fillable = [
        'booking_service_id',
        'addon_id',
        'name',
        'price',
        'quantity',
    ];

    protected static function booted(): void
    {
        static::creating(function (BookingAddon $model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    protected function casts(): array
    {
        return [
            'id' => 'string',
            'price' => 'decimal:2',
            'quantity' => 'integer',
        ];
    }

    public function bookingService(): BelongsTo
    {
        return $this->belongsTo(BookingService::class, 'booking_service_id');
    }

    public function addon(): BelongsTo
    {
        return $this->belongsTo(Addon::class, 'addon_id');
    }
}
