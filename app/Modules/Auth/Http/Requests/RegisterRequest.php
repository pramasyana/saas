<?php

declare(strict_types=1);

namespace App\Modules\Auth\Http\Requests;

use App\Modules\Pricing\Models\Plan;
use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).+$/',
            ],
            'company' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'plan_id' => ['required', 'string', 'exists:'.Plan::class.',id'],
            'billing_interval' => ['required', 'string', 'in:monthly,yearly'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama lengkap wajib diisi.',
            'email.required' => 'Email wajib diisi.',
            'email.unique' => 'Email sudah terdaftar.',
            'password.required' => 'Password wajib diisi.',
            'password.min' => 'Password minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
            'password.regex' => 'Password harus mengandung huruf besar, angka, dan karakter khusus.',
            'company.required' => 'Nama perusahaan wajib diisi.',
            'plan_id.required' => 'Pilih paket langganan.',
            'plan_id.exists' => 'Paket yang dipilih tidak tersedia.',
            'billing_interval.required' => 'Pilih interval billing.',
            'billing_interval.in' => 'Interval billing tidak valid.',
        ];
    }
}
