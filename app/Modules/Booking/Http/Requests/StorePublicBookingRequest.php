<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePublicBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'service_id' => 'nullable|uuid|exists:services,id',
            'package_id' => 'nullable|uuid|exists:packages,id',
            'services' => 'nullable|array',
            'services.*.service_id' => 'nullable|uuid|exists:services,id',
            'services.*.name' => 'required_with:services|string|max:255',
            'services.*.price' => 'required_with:services|numeric|min:0',
            'services.*.duration' => 'required_with:services|integer|min:1',
            'services.*.quantity' => 'sometimes|integer|min:1',
            'services.*.addons' => 'nullable|array',
            'services.*.addons.*.addon_id' => 'nullable|uuid|exists:addons,id',
            'services.*.addons.*.name' => 'required_with:services.*.addons|string|max:255',
            'services.*.addons.*.price' => 'required_with:services.*.addons|numeric|min:0',
            'services.*.addons.*.quantity' => 'sometimes|integer|min:1',
            'staff_id' => 'nullable|uuid|exists:staff,id',
            'branch_id' => 'required|uuid|exists:branches,id',
            'start_time' => 'required|date|after:now',
            'duration_minutes' => 'required|integer|min:15|max:480',
            'notes' => 'nullable|string|max:1000',
            'total_guests' => 'nullable|integer|min:1|max:50',
            'guest_details' => 'nullable|array',
            'guest_details.*' => 'string|max:255',
            'rooms' => 'nullable|array',
            'rooms.*.room_id' => 'required|uuid|exists:rooms,id',
            'rooms.*.start_time' => 'required|date',
            'rooms.*.end_time' => 'required|date|after:rooms.*.start_time',
            'is_group' => 'nullable|boolean',
            'max_participants' => 'nullable|integer|min:2|max:100',
            'participants' => 'nullable|array',
            'participants.*.name' => 'required_with:participants|string|max:255',
            'participants.*.phone' => 'nullable|string|max:20',
            'participants.*.email' => 'nullable|email|max:255',
            'participants.*.notes' => 'nullable|string|max:500',
            'recurring' => 'nullable|array',
            'recurring.frequency' => 'required_with:recurring|string|in:daily,weekly,monthly',
            'recurring.interval' => 'nullable|integer|min:1|max:365',
            'recurring.end_type' => 'required_with:recurring|string|in:after_count,until_date,never',
            'recurring.count' => 'nullable|integer|min:1|max:365',
            'recurring.until_date' => 'nullable|date',
        ];
    }

    public function messages(): array
    {
        return [
            'customer_name.required' => 'Nama wajib diisi.',
            'customer_email.required' => 'Email wajib diisi.',
            'customer_email.email' => 'Format email tidak valid.',
            'customer_phone.required' => 'Nomor telepon wajib diisi.',
            'branch_id.required' => 'Cabang wajib dipilih.',
            'start_time.required' => 'Waktu mulai wajib diisi.',
            'start_time.after' => 'Waktu mulai harus setelah sekarang.',
            'duration_minutes.required' => 'Durasi wajib diisi.',
            'duration_minutes.min' => 'Durasi minimal 15 menit.',
            'duration_minutes.max' => 'Durasi maksimal 480 menit.',
        ];
    }
}
