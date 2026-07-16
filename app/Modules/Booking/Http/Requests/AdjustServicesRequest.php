<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AdjustServicesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'adjustments' => 'required|array|min:1',
            'adjustments.*.action' => 'required|string|in:add,remove,update_quantity,update_price',
            'adjustments.*.service_id' => 'nullable|string|exists:services,id',
            'adjustments.*.booking_service_id' => 'nullable|string|exists:booking_services,id',
            'adjustments.*.name' => 'required_if:adjustments.*.action,add|string|max:255',
            'adjustments.*.price' => 'required_if:adjustments.*.action,add,update_price|numeric|min:0',
            'adjustments.*.duration' => 'required_if:adjustments.*.action,add|integer|min:1',
            'adjustments.*.quantity' => 'required_if:adjustments.*.action,add,update_quantity|integer|min:1',
            'notes' => 'nullable|string|max:500',
        ];
    }
}
