<?php

namespace App\Modules\Pricing\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('plans', 'slug')],
            'description' => 'nullable|string',
            'price_monthly' => 'required|numeric|min:0',
            'price_yearly' => 'nullable|numeric|min:0',
            'is_active' => 'sometimes|boolean',
            'is_popular' => 'sometimes|boolean',
            'sort_order' => 'sometimes|integer|min:0',
            'features' => 'sometimes|array',
            'features.*.feature_definition_id' => 'required|uuid|exists:feature_definitions,id',
            'features.*.value' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama plan wajib diisi.',
            'slug.unique' => 'Slug sudah digunakan.',
            'price_monthly.required' => 'Harga bulanan wajib diisi.',
            'features.*.feature_definition_id.required' => 'Feature definition wajib diisi.',
            'features.*.feature_definition_id.exists' => 'Feature definition tidak valid.',
        ];
    }
}
