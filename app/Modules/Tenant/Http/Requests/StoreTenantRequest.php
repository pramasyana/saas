<?php

declare(strict_types=1);

namespace App\Modules\Tenant\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTenantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'domain' => 'nullable|string|max:255|unique:domains,domain',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama perusahaan wajib diisi.',
            'domain.unique' => 'Domain sudah digunakan.',
        ];
    }
}
