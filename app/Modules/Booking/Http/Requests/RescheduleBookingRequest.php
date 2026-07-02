<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RescheduleBookingRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'staff_id' => 'nullable|string|exists:staff,id',
        ];
    }
}
