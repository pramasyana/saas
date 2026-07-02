<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreWaitingListRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'branch_id' => 'nullable|string|exists:branches,id',
            'customer_id' => 'required|string|exists:customers,id',
            'service_id' => 'nullable|string|exists:services,id',
            'preferred_date' => 'required|date',
            'preferred_time' => 'nullable|date_format:H:i',
            'notes' => 'nullable|string|max:1000',
        ];
    }
}
