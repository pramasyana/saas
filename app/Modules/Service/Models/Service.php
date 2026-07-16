<?php

declare(strict_types=1);

namespace App\Modules\Service\Models;

use App\Modules\Booking\Models\Room;
use App\Modules\Company\Models\Branch;
use App\Modules\Staff\Models\Staff;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class Service extends Model
{
    use BelongsToTenant, SoftDeletes;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'tenant_id',
        'branch_id',
        'category_id',
        'room_id',
        'name',
        'description',
        'duration',
        'price',
        'color',
        'is_active',
    ];

    protected static function booted(): void
    {
        static::creating(function (Service $model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    protected function casts(): array
    {
        return [
            'id' => 'string',
            'duration' => 'integer',
            'price' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class, 'branch_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class, 'room_id');
    }

    public function packages(): BelongsToMany
    {
        return $this->belongsToMany(Package::class, 'package_service', 'service_id', 'package_id')
            ->withPivot(['quantity', 'sort_order'])
            ->withTimestamps();
    }

    public function staff(): BelongsToMany
    {
        return $this->belongsToMany(Staff::class, 'staff_service', 'service_id', 'staff_id')
            ->withPivot('is_primary', 'commission_percentage');
    }
}
