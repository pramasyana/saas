<?php

declare(strict_types=1);

namespace App\Modules\Booking\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class CustomerInvoice extends Model
{
    use BelongsToTenant, SoftDeletes;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'tenant_id',
        'booking_id',
        'customer_id',
        'number',
        'subtotal',
        'tax_rate',
        'tax_amount',
        'discount_amount',
        'total_amount',
        'status',
        'payment_method',
        'paid_amount',
        'paid_at',
        'notes',
        'due_date',
    ];

    protected function casts(): array
    {
        return [
            'id' => 'string',
            'subtotal' => 'decimal:2',
            'tax_rate' => 'decimal:2',
            'tax_amount' => 'decimal:2',
            'discount_amount' => 'decimal:2',
            'total_amount' => 'decimal:2',
            'paid_amount' => 'decimal:2',
            'paid_at' => 'datetime',
            'due_date' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (CustomerInvoice $model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
            if (empty($model->number)) {
                $model->number = 'INV-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6));
            }
        });
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class, 'booking_id');
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Crm\Models\Customer::class, 'customer_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(CustomerInvoiceItem::class, 'invoice_id');
    }

    public function isPaid(): bool
    {
        return $this->status === 'paid';
    }

    public function isOverdue(): bool
    {
        return ! in_array($this->status, ['paid', 'cancelled']) && $this->due_date && $this->due_date->isPast();
    }
}
