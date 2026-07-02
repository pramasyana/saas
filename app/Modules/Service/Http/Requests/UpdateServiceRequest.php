<?php

declare(strict_types=1);

namespace App\Modules\Service\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateServiceRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'category_id' => 'nullable|string|exists:service_categories,id',
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string|max:1000',
            'duration' => 'sometimes|integer|min:1|max:1440',
            'price' => 'sometimes|numeric|min:0|max:999999999.99',
            'color' => 'nullable|string|max:20',
            'is_active' => 'boolean',
        ];
    }
}
