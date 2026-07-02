<?php

declare(strict_types=1);

namespace App\Modules\Company\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class WorkingHour extends Model
{
    use BelongsToTenant;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'tenant_id',
        'branch_id',
        'day_of_week',
        'is_open',
        'open_time',
        'close_time',
    ];

    protected static function booted(): void
    {
        static::creating(function (WorkingHour $model) {
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
            'is_open' => 'boolean',
            'day_of_week' => 'integer',
            'open_time' => 'datetime:H:i',
            'close_time' => 'datetime:H:i',
        ];
    }
}
