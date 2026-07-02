<?php

declare(strict_types=1);

namespace App\Modules\Service\Http\Resources;

use App\Modules\Service\Models\Promotion;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Promotion */
class PromotionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'code' => $this->code,
            'promotion_type' => $this->promotion_type,
            'promotion_label' => $this->getPromotionLabel(),
            'value' => (float) $this->value,
            'conditions' => $this->conditions,
            'usage_limit' => $this->usage_limit,
            'usage_count' => $this->usage_count,
            'min_purchase' => $this->min_purchase ? (float) $this->min_purchase : null,
            'max_discount' => $this->max_discount ? (float) $this->max_discount : null,
            'is_active' => $this->is_active,
            'start_date' => $this->start_date?->format('Y-m-d'),
            'end_date' => $this->end_date?->format('Y-m-d'),
            'created_at' => $this->created_at?->format('d M Y'),
        ];
    }

    private function getPromotionLabel(): string
    {
        return match ($this->promotion_type) {
            'percentage' => "{$this->value}% Off",
            'fixed' => 'Rp '.number_format((float) $this->value, 0, ',', '.').' Off',
            'buy_x_get_y' => 'Buy X Get Y',
            default => $this->promotion_type,
        };
    }
}
