<?php

declare(strict_types=1);

namespace App\Modules\Service\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAddonRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'price' => 'required|numeric|min:0|max:999999999.99',
            'duration' => 'nullable|integer|min:1|max:1440',
            'is_active' => 'boolean',
        ];
    }
}
