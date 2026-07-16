<?php

declare(strict_types=1);

namespace App\Modules\Financing\Http\Resources;

use App\Modules\Financing\Models\Cost;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Cost */
class CostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'amount' => (float) $this->amount,
            'date' => $this->date?->format('Y-m-d'),
            'notes' => $this->notes,
            'attachment' => $this->attachment,
            'category' => [
                'id' => $this->category?->id,
                'name' => $this->category?->name,
                'color' => $this->category?->color,
            ],
            'creator' => [
                'id' => $this->creator?->id,
                'name' => $this->creator?->name,
            ],
            'created_at' => $this->created_at?->format('d M Y H:i'),
        ];
    }
}
