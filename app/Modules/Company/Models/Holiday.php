<?php

declare(strict_types=1);

namespace App\Modules\Company\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class Holiday extends Model
{
    use BelongsToTenant;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'tenant_id',
        'branch_id',
        'name',
        'date_start',
        'date_end',
        'is_recurring_yearly',
        'description',
    ];

    protected static function booted(): void
    {
        static::creating(function (Holiday $model) {
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
            'date_start' => 'date:Y-m-d',
            'date_end' => 'date:Y-m-d',
            'is_recurring_yearly' => 'boolean',
        ];
    }
}
