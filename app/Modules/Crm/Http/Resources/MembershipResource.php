<?php

declare(strict_types=1);

namespace App\Modules\Crm\Http\Resources;

use App\Modules\Crm\Models\Membership;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Membership */
class MembershipResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'points' => $this->points,
            'total_spent' => (float) $this->total_spent,
            'joined_at' => $this->joined_at?->format('Y-m-d'),
            'expired_at' => $this->expired_at?->format('Y-m-d'),
            'tier' => new MembershipTierResource($this->whenLoaded('tier')),
        ];
    }
}
