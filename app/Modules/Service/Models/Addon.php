<?php

declare(strict_types=1);

namespace App\Modules\Service\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class Addon extends Model
{
    use BelongsToTenant, SoftDeletes;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'tenant_id',
        'name',
        'description',
        'price',
        'duration',
        'is_active',
    ];

    protected static function booted(): void
    {
        static::creating(function (Addon $model) {
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
            'is_active' => 'boolean',
        ];
    }
}
