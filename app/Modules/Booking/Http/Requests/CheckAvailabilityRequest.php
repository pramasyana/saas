<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckAvailabilityRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'date' => 'required|date_format:Y-m-d',
            'service_id' => 'required|string|exists:services,id',
            'duration' => 'required|integer|min:1',
            'branch_id' => 'nullable|string|exists:branches,id',
            'staff_id' => 'nullable|string|exists:staff,id',
        ];
    }
}
