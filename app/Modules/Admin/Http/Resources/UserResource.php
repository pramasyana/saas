<?php

namespace App\Modules\Admin\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin User */
class UserResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'is_admin' => $this->is_admin,
            'is_active' => $this->is_active,
            'email_verified_at' => $this->email_verified_at,
            'is_verified' => $this->hasVerifiedEmail(),
            'tenant_id' => $this->tenant_id,
            'tenant' => $this->whenLoaded('tenant', fn () => [
                'id' => $this->tenant->id,
                'name' => $this->tenant->company_name,
            ]),
            'created_at' => $this->created_at?->diffForHumans(),
            'joined_at' => $this->created_at?->format('d M Y'),
        ];
    }
}
