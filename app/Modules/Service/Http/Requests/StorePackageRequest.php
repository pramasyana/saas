<?php

declare(strict_types=1);

namespace App\Modules\Service\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePackageRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'price' => 'required|numeric|min:0|max:999999999.99',
            'duration' => 'nullable|integer|min:0|max:14400',
            'is_active' => 'boolean',
            'services' => 'nullable|array',
            'services.*.service_id' => 'required|string|exists:services,id',
            'services.*.quantity' => 'nullable|integer|min:1|max:999',
            'services.*.sort_order' => 'nullable|integer|min:0|max:999',
        ];
    }
}
