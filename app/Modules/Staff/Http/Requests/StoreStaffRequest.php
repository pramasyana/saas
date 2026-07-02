<?php

declare(strict_types=1);

namespace App\Modules\Staff\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStaffRequest extends FormRequest
{
    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'position' => 'nullable|string|max:100',
            'branch_id' => 'nullable|string|exists:branches,id',
            'hire_date' => 'nullable|date',
            'is_active' => 'boolean',
        ];
    }
}
