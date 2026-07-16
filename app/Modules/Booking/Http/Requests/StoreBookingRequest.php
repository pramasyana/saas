<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Requests;

use App\Modules\Setting\Services\TenantSettingService;
use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    public function rules(): array
    {
        $sources = app(TenantSettingService::class)->get('booking.sources', ['online', 'walk_in', 'recurring']);

        return [
            'branch_id' => 'nullable|string|exists:branches,id',
            'customer_id' => 'required|string|exists:customers,id',
            'staff_id' => 'nullable|string|exists:staff,id',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'duration_minutes' => 'required|integer|min:1',
            'status' => 'sometimes|string|in:pending,confirmed',
            'source' => 'sometimes|string|in:' . implode(',', $sources),
            'notes' => 'nullable|string|max:1000',
            'is_group' => 'sometimes|boolean',
            'max_participants' => 'nullable|integer|min:1|max:10000',
            'participants' => 'nullable|array',
            'participants.*.name' => 'required_with:participants|string|max:255',
            'participants.*.phone' => 'nullable|string|max:20',
            'participants.*.email' => 'nullable|string|email|max:255',
            'participants.*.notes' => 'nullable|string|max:500',
            'rooms' => 'nullable|array',
            'rooms.*.room_id' => 'required|string|exists:rooms,id',
            'rooms.*.start_time' => 'required|date',
            'rooms.*.end_time' => 'required|date|after:rooms.*.start_time',
            'services' => 'nullable|array',
            'services.*.service_id' => 'nullable|string|exists:services,id',
            'services.*.staff_id' => 'nullable|string|exists:staff,id',
            'services.*.name' => 'required_with:services|string|max:255',
            'services.*.price' => 'required_with:services|numeric|min:0',
            'services.*.duration' => 'required_with:services|integer|min:1',
            'services.*.quantity' => 'sometimes|integer|min:1',
            'services.*.sort_order' => 'sometimes|integer|min:0',
            'recurring' => 'nullable|array',
            'recurring.frequency' => 'required_with:recurring|string|in:daily,weekly,monthly',
            'recurring.interval' => 'nullable|integer|min:1|max:365',
            'recurring.days_of_week' => 'nullable|array',
            'recurring.days_of_week.*' => 'integer|min:0|max:6',
            'recurring.end_type' => 'required_with:recurring|string|in:after_count,until_date,never',
            'recurring.count' => 'nullable|integer|min:1|max:365',
            'recurring.until_date' => 'nullable|date',
        ];
    }
}
