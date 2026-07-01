<?php

namespace App\Modules\Pricing\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFeatureDefinitionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'key' => 'required|string|max:255|unique:feature_definitions,key',
            'label' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|string|in:boolean,numeric',
            'default_value' => 'nullable|string',
            'category' => 'sometimes|string|in:features,limits,support,customization',
            'sort_order' => 'sometimes|integer|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'key.required' => 'Key wajib diisi.',
            'key.unique' => 'Key sudah digunakan.',
            'label.required' => 'Label wajib diisi.',
            'type.required' => 'Tipe wajib diisi.',
            'type.in' => 'Tipe harus boolean atau numeric.',
        ];
    }
}
