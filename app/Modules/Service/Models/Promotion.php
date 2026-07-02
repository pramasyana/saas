<?php

declare(strict_types=1);

namespace App\Modules\Service\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class Promotion extends Model
{
    use BelongsToTenant, SoftDeletes;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'tenant_id',
        'name',
        'description',
        'code',
        'promotion_type',
        'value',
        'conditions',
        'usage_limit',
        'usage_count',
        'min_purchase',
        'max_discount',
        'is_active',
        'start_date',
        'end_date',
    ];

    protected static function booted(): void
    {
        static::creating(function (Promotion $model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    protected function casts(): array
    {
        return [
            'id' => 'string',
            'value' => 'decimal:2',
            'conditions' => 'array',
            'usage_limit' => 'integer',
            'usage_count' => 'integer',
            'min_purchase' => 'decimal:2',
            'max_discount' => 'decimal:2',
            'is_active' => 'boolean',
            'start_date' => 'date:Y-m-d',
            'end_date' => 'date:Y-m-d',
        ];
    }
}
