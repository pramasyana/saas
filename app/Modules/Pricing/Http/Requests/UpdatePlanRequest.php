<?php

namespace App\Modules\Pricing\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|max:255|unique:plans,slug,' . $this->route('id'),
            'description' => 'nullable|string|max:1000',
            'price_monthly' => 'sometimes|numeric|min:0',
            'price_yearly' => 'nullable|numeric|min:0',
            'is_active' => 'sometimes|boolean',
            'is_popular' => 'sometimes|boolean',
            'sort_order' => 'sometimes|integer|min:0',
            'features' => 'nullable|array',
            'features.*.feature_definition_id' => 'required|exists:feature_definitions,id',
            'features.*.value' => 'nullable|string',
        ];
    }
}
