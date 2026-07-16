<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerInvoiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'number' => $this->number,
            'booking_id' => $this->booking_id,
            'customer_id' => $this->customer_id,
            'customer_name' => $this->whenLoaded('customer', fn () => $this->customer->name),
            'customer_email' => $this->whenLoaded('customer', fn () => $this->customer->email),
            'customer_phone' => $this->whenLoaded('customer', fn () => $this->customer->phone),
            'customer_address' => $this->whenLoaded('customer', fn () => $this->customer->address),
            'booking_code' => $this->whenLoaded('booking', fn () => $this->booking->booking_code),
            'subtotal' => (float) $this->subtotal,
            'tax_rate' => (float) $this->tax_rate,
            'tax_amount' => (float) $this->tax_amount,
            'discount_amount' => (float) $this->discount_amount,
            'total_amount' => (float) $this->total_amount,
            'status' => $this->status,
            'status_label' => $this->statusLabel(),
            'payment_method' => $this->payment_method,
            'payment_method_label' => $this->paymentMethodLabel(),
            'paid_amount' => (float) $this->paid_amount,
            'paid_at' => $this->paid_at?->toISOString(),
            'notes' => $this->notes,
            'due_date' => $this->due_date?->toISOString(),
            'is_overdue' => $this->isOverdue(),
            'items' => CustomerInvoiceItemResource::collection($this->whenLoaded('items')),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }

    private function statusLabel(): string
    {
        return match ($this->status) {
            'draft' => 'Draft',
            'pending' => 'Belum Bayar',
            'paid' => 'Lunas',
            'partial' => 'Bayar Sebagian',
            'cancelled' => 'Dibatalkan',
            default => $this->status,
        };
    }

    private function paymentMethodLabel(): ?string
    {
        if (! $this->payment_method) {
            return null;
        }

        return match ($this->payment_method) {
            'cash' => 'Tunai',
            'card' => 'Kartu',
            'transfer' => 'Transfer',
            'e-wallet' => 'E-Wallet',
            'other' => 'Lainnya',
            default => $this->payment_method,
        };
    }
}
