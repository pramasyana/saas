<?php

declare(strict_types=1);

namespace App\Modules\Staff\Http\Resources;

use App\Modules\Staff\Models\Commission;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Commission */
class CommissionResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'staff_id' => $this->staff_id,
            'staff_name' => $this->whenLoaded('staff', fn () => $this->staff?->name),
            'booking_id' => $this->booking_id,
            'amount' => (float) $this->amount,
            'amount_formatted' => number_format((float) $this->amount, 2),
            'type' => $this->type,
            'type_label' => match ($this->type) {
                'service' => 'Jasa',
                'product' => 'Produk',
                'bonus' => 'Bonus',
                default => $this->type,
            },
            'date' => $this->date?->format('Y-m-d'),
            'notes' => $this->notes,
            'created_at' => $this->created_at?->format('d M Y'),
        ];
    }
}
