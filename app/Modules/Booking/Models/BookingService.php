<?php

declare(strict_types=1);

namespace App\Modules\Booking\Models;

use App\Modules\Service\Models\Service;
use App\Modules\Staff\Models\Staff;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class BookingService extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $table = 'booking_services';

    protected $fillable = [
        'booking_id',
        'service_id',
        'staff_id',
        'name',
        'price',
        'duration',
        'quantity',
        'sort_order',
    ];

    protected static function booted(): void
    {
        static::creating(function (BookingService $model) {
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
            'duration' => 'integer',
            'quantity' => 'integer',
            'sort_order' => 'integer',
        ];
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class, 'booking_id');
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class, 'service_id');
    }

    public function staff(): BelongsTo
    {
        return $this->belongsTo(Staff::class, 'staff_id');
    }

    public function addons(): HasMany
    {
        return $this->hasMany(BookingAddon::class, 'booking_service_id');
    }
}
