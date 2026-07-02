<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'branch_id' => 'nullable|string|exists:branches,id',
            'customer_id' => 'required|string|exists:customers,id',
            'staff_id' => 'nullable|string|exists:staff,id',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'duration_minutes' => 'required|integer|min:1',
            'status' => 'sometimes|string|in:pending,confirmed',
            'source' => 'sometimes|string|in:online,walk_in',
            'notes' => 'nullable|string|max:1000',
            'services' => 'nullable|array',
            'services.*.service_id' => 'nullable|string|exists:services,id',
            'services.*.name' => 'required_with:services|string|max:255',
            'services.*.price' => 'required_with:services|numeric|min:0',
            'services.*.duration' => 'required_with:services|integer|min:1',
            'services.*.quantity' => 'sometimes|integer|min:1',
            'services.*.sort_order' => 'sometimes|integer|min:0',
        ];
    }
}
