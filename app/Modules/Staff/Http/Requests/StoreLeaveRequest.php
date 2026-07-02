<?php

declare(strict_types=1);

namespace App\Modules\Staff\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLeaveRequest extends FormRequest
{
    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'staff_id' => 'required|string|exists:staff,id',
            'type' => 'required|string|in:sick,vacation,other',
            'date_start' => 'required|date',
            'date_end' => 'required|date|after_or_equal:date_start',
            'reason' => 'nullable|string|max:500',
        ];
    }
}
