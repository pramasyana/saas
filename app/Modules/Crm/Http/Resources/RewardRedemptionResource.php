<?php

declare(strict_types=1);

namespace App\Modules\Crm\Http\Resources;

use App\Modules\Crm\Models\RewardRedemption;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin RewardRedemption */
class RewardRedemptionResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'points_spent' => $this->points_spent,
            'status' => $this->status,
            'notes' => $this->notes,
            'reward' => new RewardResource($this->whenLoaded('reward')),
            'created_at' => $this->created_at?->format('d M Y H:i'),
        ];
    }
}
