<?php

declare(strict_types=1);

namespace App\Modules\Crm\Http\Resources;

use App\Modules\Crm\Models\Reward;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Reward */
class RewardResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'points_required' => $this->points_required,
            'stock' => $this->stock,
            'image' => $this->image,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at?->format('d M Y'),
        ];
    }
}
