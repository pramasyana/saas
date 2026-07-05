<?php

declare(strict_types=1);

namespace App\Modules\Booking\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class BookingReminder extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $table = 'booking_reminders';

    protected $fillable = [
        'booking_id',
        'type',
        'status',
        'scheduled_at',
        'sent_at',
        'error_message',
    ];

    protected static function booted(): void
    {
        static::creating(function (BookingReminder $model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    protected function casts(): array
    {
        return [
            'id' => 'string',
            'scheduled_at' => 'datetime',
            'sent_at' => 'datetime',
        ];
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class, 'booking_id');
    }
}
