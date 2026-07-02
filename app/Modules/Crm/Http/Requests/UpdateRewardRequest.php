<?php

declare(strict_types=1);

namespace App\Modules\Crm\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRewardRequest extends FormRequest
{
    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'points_required' => 'sometimes|integer',
            'stock' => 'nullable|integer',
            'image' => 'nullable|string',
            'is_active' => 'boolean',
        ];
    }
}
