<?php

declare(strict_types=1);

namespace App\Modules\Tenant\Http\Resources;

use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Tenant */
class TenantResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->company_name,
            'email' => $this->company_email,
            'phone' => $this->company_phone,
            'data' => $this->data,
            'domains' => $this->whenLoaded('domains', fn () => $this->domains->pluck('domain')),
            'user' => $this->whenLoaded('user', fn () => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
            ]),
            'users_count' => $this->whenCounted('users'),
            'subscriptions_count' => $this->whenCounted('subscriptions'),
            'created_at' => $this->created_at?->diffForHumans(),
            'joined_at' => $this->created_at?->format('d M Y'),
        ];
    }
}
