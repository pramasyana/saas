<?php

declare(strict_types=1);

namespace App\Modules\Service\Models;

use App\Modules\Company\Models\Branch;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class PricingRule extends Model
{
    use BelongsToTenant, SoftDeletes;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'tenant_id',
        'branch_id',
        'name',
        'description',
        'action_type',
        'value',
        'conditions',
        'priority',
        'is_active',
        'start_date',
        'end_date',
    ];

    protected static function booted(): void
    {
        static::creating(function (PricingRule $model) {
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
            'priority' => 'integer',
            'is_active' => 'boolean',
            'start_date' => 'date:Y-m-d',
            'end_date' => 'date:Y-m-d',
        ];
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class, 'branch_id');
    }
}
