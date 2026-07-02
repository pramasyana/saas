<?php

declare(strict_types=1);

namespace App\Modules\Service\Models;

use App\Modules\Company\Models\Branch;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class Package extends Model
{
    use BelongsToTenant, SoftDeletes;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'tenant_id',
        'branch_id',
        'name',
        'description',
        'price',
        'duration',
        'is_active',
    ];

    protected static function booted(): void
    {
        static::creating(function (Package $model) {
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

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class, 'branch_id');
    }

    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'package_service', 'package_id', 'service_id')
            ->withPivot(['quantity', 'sort_order'])
            ->withTimestamps()
            ->orderByPivot('sort_order');
    }
}
