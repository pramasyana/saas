<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBookingRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'branch_id' => 'sometimes|string|exists:branches,id',
            'customer_id' => 'sometimes|string|exists:customers,id',
            'staff_id' => 'nullable|string|exists:staff,id',
            'start_time' => 'sometimes|date',
            'end_time' => 'sometimes|date|after:start_time',
            'duration_minutes' => 'sometimes|integer|min:1',
            'notes' => 'nullable|string|max:1000',
        ];
    }
}
