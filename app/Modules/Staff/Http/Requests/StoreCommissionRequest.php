<?php

declare(strict_types=1);

namespace App\Modules\Staff\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCommissionRequest extends FormRequest
{
    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'staff_id' => 'required|string|exists:staff,id',
            'booking_id' => 'nullable|string',
            'amount' => 'required|numeric|min:0',
            'type' => 'required|string|in:service,product,bonus',
            'date' => 'required|date',
            'notes' => 'nullable|string|max:500',
        ];
    }
}
