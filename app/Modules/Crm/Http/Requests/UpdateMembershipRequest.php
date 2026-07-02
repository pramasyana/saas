<?php

declare(strict_types=1);

namespace App\Modules\Crm\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMembershipRequest extends FormRequest
{
    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'membership_tier_id' => 'nullable|string|exists:membership_tiers,id',
            'points' => 'nullable|integer',
            'total_spent' => 'nullable|numeric',
        ];
    }
}
