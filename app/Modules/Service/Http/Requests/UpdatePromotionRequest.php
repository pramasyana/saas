<?php

declare(strict_types=1);

namespace App\Modules\Service\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePromotionRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string|max:2000',
            'code' => 'nullable|string|max:50',
            'promotion_type' => 'sometimes|string|in:percentage,fixed,buy_x_get_y',
            'value' => 'sometimes|numeric|min:0|max:999999999.99',
            'conditions' => 'nullable|array',
            'usage_limit' => 'nullable|integer|min:0|max:999999',
            'min_purchase' => 'nullable|numeric|min:0|max:999999999.99',
            'max_discount' => 'nullable|numeric|min:0|max:999999999.99',
            'is_active' => 'boolean',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ];
    }
}
