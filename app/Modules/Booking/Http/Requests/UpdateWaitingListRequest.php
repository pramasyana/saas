<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWaitingListRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'customer_id' => 'sometimes|string|exists:customers,id',
            'service_id' => 'nullable|string|exists:services,id',
            'preferred_date' => 'sometimes|date',
            'preferred_time' => 'nullable|date_format:H:i',
            'notes' => 'nullable|string|max:1000',
            'status' => 'sometimes|string|in:waiting,notified,booked,cancelled',
        ];
    }
}
