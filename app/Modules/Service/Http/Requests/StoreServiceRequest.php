<?php

declare(strict_types=1);

namespace App\Modules\Service\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'category_id' => 'nullable|string|exists:service_categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'duration' => 'required|integer|min:1|max:1440',
            'price' => 'required|numeric|min:0|max:999999999.99',
            'color' => 'nullable|string|max:20',
            'is_active' => 'boolean',
        ];
    }
}
