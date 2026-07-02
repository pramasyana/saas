<?php

declare(strict_types=1);

namespace App\Modules\Company\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class Branch extends Model
{
    use BelongsToTenant, SoftDeletes;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'tenant_id',
        'name',
        'slug',
        'address',
        'phone',
        'email',
        'manager_name',
        'is_active',
        'sort_order',
        'is_default',
    ];

    protected static function booted(): void
    {
        static::creating(function (Branch $branch) {
            if (empty($branch->id)) {
                $branch->id = (string) Str::uuid();
            }
        });
    }

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'id' => 'string',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'is_default' => 'boolean',
        ];
    }
}
