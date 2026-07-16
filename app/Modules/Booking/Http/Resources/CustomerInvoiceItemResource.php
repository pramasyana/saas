<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerInvoiceItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'type_label' => $this->typeLabel(),
            'name' => $this->name,
            'quantity' => (int) $this->quantity,
            'unit_price' => (float) $this->unit_price,
            'total_price' => (float) $this->total_price,
            'metadata' => $this->metadata,
        ];
    }

    private function typeLabel(): string
    {
        return match ($this->type) {
            'service' => 'Layanan',
            'addon' => 'Add-on',
            'discount' => 'Diskon',
            'tax' => 'Pajak',
            default => $this->type,
        };
    }
}
