<?php

declare(strict_types=1);

namespace App\Modules\Service\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCategoryRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'color' => 'nullable|string|max:20',
            'sort_order' => 'nullable|integer|min:0|max:999',
            'is_active' => 'boolean',
        ];
    }
}
