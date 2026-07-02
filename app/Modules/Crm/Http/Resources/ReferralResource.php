<?php

declare(strict_types=1);

namespace App\Modules\Crm\Http\Resources;

use App\Modules\Crm\Models\Referral;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Referral */
class ReferralResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'referred_name' => $this->referred_name,
            'referred_email' => $this->referred_email,
            'status' => $this->status,
            'reward_given' => $this->reward_given,
            'created_at' => $this->created_at?->format('d M Y'),
        ];
    }
}
