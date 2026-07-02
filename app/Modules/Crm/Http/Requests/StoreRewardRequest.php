<?php

declare(strict_types=1);

namespace App\Modules\Crm\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRewardRequest extends FormRequest
{
    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'points_required' => 'required|integer',
            'stock' => 'nullable|integer',
            'image' => 'nullable|string',
            'is_active' => 'boolean',
        ];
    }
}
