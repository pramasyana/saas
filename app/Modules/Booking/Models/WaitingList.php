<?php

declare(strict_types=1);

namespace App\Modules\Booking\Models;

use App\Modules\Company\Models\Branch;
use App\Modules\Crm\Models\Customer;
use App\Modules\Service\Models\Service;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class WaitingList extends Model
{
    use BelongsToTenant, SoftDeletes;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $table = 'waiting_list';

    protected $fillable = [
        'tenant_id',
        'branch_id',
        'customer_id',
        'service_id',
        'preferred_date',
        'preferred_time',
        'notes',
        'status',
        'position',
        'notified_at',
    ];

    protected static function booted(): void
    {
        static::creating(function (WaitingList $model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    protected function casts(): array
    {
        return [
            'id' => 'string',
            'preferred_date' => 'date:Y-m-d',
            'preferred_time' => 'datetime:H:i',
            'notified_at' => 'datetime',
            'position' => 'integer',
        ];
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class, 'branch_id');
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class, 'service_id');
    }
}
