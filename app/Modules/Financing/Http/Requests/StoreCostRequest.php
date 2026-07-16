<?php

declare(strict_types=1);

namespace App\Modules\Financing\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCostRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'cost_category_id' => 'required|uuid|exists:cost_categories,id',
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date',
            'notes' => 'nullable|string|max:1000',
        ];
    }
}
