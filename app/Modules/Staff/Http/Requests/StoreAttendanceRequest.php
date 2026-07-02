<?php

declare(strict_types=1);

namespace App\Modules\Staff\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAttendanceRequest extends FormRequest
{
    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'staff_id' => 'required|string|exists:staff,id',
            'date' => 'required|date',
            'clock_in' => 'nullable|date_format:H:i',
            'clock_out' => 'nullable|date_format:H:i',
            'status' => 'required|string|in:present,late,absent,half_day',
            'notes' => 'nullable|string|max:500',
        ];
    }
}
