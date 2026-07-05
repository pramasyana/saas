<?php

declare(strict_types=1);

namespace App\Modules\Crm\Http\Resources;

use App\Modules\Crm\Models\CustomerSubscription;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin CustomerSubscription */
class CustomerSubscriptionResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'customer_id' => $this->customer_id,
            'customer' => $this->whenLoaded('customer', fn () => [
                'id' => $this->customer->id,
                'name' => $this->customer->name,
                'phone' => $this->customer->phone,
            ]),
            'plan_id' => $this->plan_id,
            'plan' => $this->whenLoaded('plan', fn () => [
                'id' => $this->plan->id,
                'name' => $this->plan->name,
            ]),
            'plan_name' => $this->plan_name,
            'price_amount' => (float) $this->price_amount,
            'billing_interval' => $this->billing_interval,
            'benefits_snapshot' => $this->benefits_snapshot,
            'status' => $this->status,
            'start_date' => $this->start_date?->format('d M Y'),
            'end_date' => $this->end_date?->format('d M Y'),
            'cancelled_at' => $this->cancelled_at?->format('d M Y'),
            'created_at' => $this->created_at?->format('d M Y'),
        ];
    }
}
