<?php

declare(strict_types=1);

namespace App\Modules\Financing\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCostCategoryRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'color' => 'nullable|string|max:7',
            'sort_order' => 'nullable|integer|min:0',
        ];
    }
}
