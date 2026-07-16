<?php

declare(strict_types=1);

namespace App\Modules\Booking\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class CustomerInvoiceItem extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $table = 'customer_invoice_items';

    protected $fillable = [
        'invoice_id',
        'type',
        'name',
        'quantity',
        'unit_price',
        'total_price',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'id' => 'string',
            'quantity' => 'integer',
            'unit_price' => 'decimal:2',
            'total_price' => 'decimal:2',
            'metadata' => 'array',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (CustomerInvoiceItem $model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(CustomerInvoice::class, 'invoice_id');
    }
}
