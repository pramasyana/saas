<?php

declare(strict_types=1);

namespace App\Modules\Staff\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class Staff extends Model
{
    use BelongsToTenant, SoftDeletes;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'tenant_id',
        'branch_id',
        'name',
        'email',
        'phone',
        'position',
        'hire_date',
        'is_active',
    ];

    protected static function booted(): void
    {
        static::creating(function (Staff $model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'id' => 'string',
            'is_active' => 'boolean',
            'hire_date' => 'date:Y-m-d',
        ];
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(StaffSchedule::class, 'staff_id');
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class, 'staff_id');
    }

    public function leaves(): HasMany
    {
        return $this->hasMany(Leave::class, 'staff_id');
    }

    public function commissions(): HasMany
    {
        return $this->hasMany(Commission::class, 'staff_id');
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Company\Models\Branch::class, 'branch_id');
    }
}
