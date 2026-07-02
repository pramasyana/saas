<?php

declare(strict_types=1);

namespace App\Modules\Crm\Http\Resources;

use App\Modules\Crm\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Customer */
class CustomerResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'company' => $this->company,
            'address' => $this->address,
            'birthday' => $this->birthday?->format('Y-m-d'),
            'avatar' => $this->avatar,
            'is_active' => $this->is_active,
            'tags' => TagResource::collection($this->whenLoaded('tags')),
            'membership' => new MembershipResource($this->whenLoaded('membership')),
            'notes_count' => $this->when(isset($this->notes_count), $this->notes_count),
            'tags_count' => $this->when(isset($this->tags_count), $this->tags_count),
            'created_at' => $this->created_at?->format('d M Y'),
        ];
    }
}
