<?php

namespace App\Modules\Pricing\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFeatureDefinitionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'key' => 'sometimes|string|max:255|unique:feature_definitions,key,'.$this->route('id'),
            'label' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'type' => 'sometimes|string|in:boolean,numeric',
            'default_value' => 'nullable|string',
            'category' => 'sometimes|string|in:features,limits,support,customization',
            'sort_order' => 'sometimes|integer|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'key.unique' => 'Key sudah digunakan.',
        ];
    }
}
