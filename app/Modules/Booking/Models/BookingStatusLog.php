<?php

declare(strict_types=1);

namespace App\Modules\Booking\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class BookingStatusLog extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $table = 'booking_status_logs';

    protected $fillable = [
        'booking_id',
        'from_status',
        'to_status',
        'changed_by',
        'notes',
    ];

    protected static function booted(): void
    {
        static::creating(function (BookingStatusLog $model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    protected function casts(): array
    {
        return [
            'id' => 'string',
        ];
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class, 'booking_id');
    }

    public function changedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
