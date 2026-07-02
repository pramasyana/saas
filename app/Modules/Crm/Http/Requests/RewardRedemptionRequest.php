<?php

declare(strict_types=1);

namespace App\Modules\Crm\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RewardRedemptionRequest extends FormRequest
{
    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'reward_id' => 'required|string|exists:rewards,id',
            'customer_id' => 'required|string|exists:customers,id',
        ];
    }
}
