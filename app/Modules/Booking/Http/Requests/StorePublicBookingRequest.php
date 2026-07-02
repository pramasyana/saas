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
            'service_id' => 'required|uuid|exists:services,id',
            'staff_id' => 'nullable|uuid|exists:staff,id',
            'branch_id' => 'required|uuid|exists:branches,id',
            'start_time' => 'required|date|after:now',
            'duration_minutes' => 'required|integer|min:15|max:480',
            'notes' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'customer_name.required' => 'Nama wajib diisi.',
            'customer_email.required' => 'Email wajib diisi.',
            'customer_email.email' => 'Format email tidak valid.',
            'customer_phone.required' => 'Nomor telepon wajib diisi.',
            'service_id.required' => 'Layanan wajib dipilih.',
            'branch_id.required' => 'Cabang wajib dipilih.',
            'start_time.required' => 'Waktu mulai wajib diisi.',
            'start_time.after' => 'Waktu mulai harus setelah sekarang.',
            'duration_minutes.required' => 'Durasi wajib diisi.',
            'duration_minutes.min' => 'Durasi minimal 15 menit.',
            'duration_minutes.max' => 'Durasi maksimal 480 menit.',
        ];
    }
}
