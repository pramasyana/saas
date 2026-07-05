<?php

declare(strict_types=1);

namespace App\Modules\Crm\Http\Resources;

use App\Modules\Crm\Models\CustomerMembershipPlan;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin CustomerMembershipPlan */
class CustomerMembershipPlanResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => (float) $this->price,
            'billing_interval' => $this->billing_interval,
            'duration_months' => $this->duration_months,
            'benefits' => $this->benefits,
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
            'created_at' => $this->created_at?->format('d M Y'),
            'subscriptions_count' => $this->whenCounted('subscriptions'),
        ];
    }
}
