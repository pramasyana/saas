<?php

declare(strict_types=1);

namespace App\Modules\Booking\Models;

use App\Modules\Company\Models\Branch;
use App\Modules\Crm\Models\Customer;
use App\Modules\Setting\Services\TenantSettingService;
use App\Modules\Staff\Models\Staff;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
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
        'booking_code',
        'total_guests',
        'guest_details',
        'is_group',
        'max_participants',
        'recurring_template_id',
    ];

    protected static function booted(): void
    {
        static::creating(function (Booking $model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
            if (empty($model->booking_code)) {
                $prefix = app(TenantSettingService::class)->get('booking.code_prefix', 'BK-');
                $today = now()->format('Ymd');
                $last = static::whereDate('created_at', today())
                    ->where('booking_code', 'like', "{$prefix}{$today}-%")
                    ->orderBy('booking_code', 'desc')
                    ->first();
                $seq = $last ? (int) substr($last->booking_code, -3) + 1 : 1;
                $model->booking_code = sprintf('%s%s-%03d', $prefix, $today, $seq);
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
            'total_guests' => 'integer',
            'guest_details' => 'array',
            'is_group' => 'boolean',
            'max_participants' => 'integer',
        ];
    }

    public function findByBookingCode(string $code): ?self
    {
        return static::where('booking_code', $code)->first();
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

    public function participants(): HasMany
    {
        return $this->hasMany(BookingParticipant::class, 'booking_id');
    }

    public function rooms(): BelongsToMany
    {
        return $this->belongsToMany(Room::class, 'booking_rooms', 'booking_id', 'room_id')
            ->withPivot(['start_time', 'end_time'])
            ->withTimestamps();
    }
}
