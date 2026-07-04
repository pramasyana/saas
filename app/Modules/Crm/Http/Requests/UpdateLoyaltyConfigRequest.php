<?php

declare(strict_types=1);

namespace App\Modules\Crm\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLoyaltyConfigRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'enabled' => 'boolean',
            'mode' => 'in:percentage,fixed',
            'points_per_amount' => 'integer|min:1',
            'points_fixed' => 'integer|min:1',
        ];
    }
}
