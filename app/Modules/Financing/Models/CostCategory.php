<?php

declare(strict_types=1);

namespace App\Modules\Financing\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class CostCategory extends Model
{
    use BelongsToTenant, SoftDeletes;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'tenant_id', 'name', 'description', 'color', 'sort_order',
    ];

    protected static function booted(): void
    {
        static::creating(function (CostCategory $model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    protected function casts(): array
    {
        return [
            'id' => 'string',
            'sort_order' => 'integer',
        ];
    }

    public function costs(): HasMany
    {
        return $this->hasMany(Cost::class);
    }
}
