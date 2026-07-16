<?php

declare(strict_types=1);

namespace App\Modules\Staff\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class StaffShiftAssignment extends Model
{
    use BelongsToTenant;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $table = 'staff_shift_assignments';

    protected $fillable = [
        'tenant_id',
        'staff_id',
        'date',
        'start_time',
        'end_time',
        'notes',
    ];

    protected static function booted(): void
    {
        static::creating(function (StaffShiftAssignment $model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    protected function casts(): array
    {
        return [
            'id' => 'string',
            'date' => 'date:Y-m-d',
        ];
    }

    public function staff(): BelongsTo
    {
        return $this->belongsTo(Staff::class, 'staff_id');
    }
}
