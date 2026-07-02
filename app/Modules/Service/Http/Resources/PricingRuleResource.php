<?php

declare(strict_types=1);

namespace App\Modules\Service\Http\Resources;

use App\Modules\Service\Models\PricingRule;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin PricingRule */
class PricingRuleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'action_type' => $this->action_type,
            'action_label' => $this->getActionLabel(),
            'value' => (float) $this->value,
            'conditions' => $this->conditions,
            'priority' => $this->priority,
            'is_active' => $this->is_active,
            'start_date' => $this->start_date?->format('Y-m-d'),
            'end_date' => $this->end_date?->format('Y-m-d'),
            'created_at' => $this->created_at?->format('d M Y'),
        ];
    }

    private function getActionLabel(): string
    {
        return match ($this->action_type) {
            'percentage_discount' => "{$this->value}% Discount",
            'fixed_discount' => 'Rp ' . number_format((float) $this->value, 0, ',', '.') . ' Discount',
            'percentage_surcharge' => "{$this->value}% Surcharge",
            'fixed_surcharge' => 'Rp ' . number_format((float) $this->value, 0, ',', '.') . ' Surcharge',
            'price_override' => 'Rp ' . number_format((float) $this->value, 0, ',', '.'),
            default => $this->action_type,
        };
    }
}
