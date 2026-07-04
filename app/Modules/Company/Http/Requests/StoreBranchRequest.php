<?php

declare(strict_types=1);

namespace App\Modules\Company\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBranchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $tenantId = $this->user()?->tenant_id;

        return [
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:branches,slug,null,id,tenant_id,'.$tenantId,
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'whatsapp' => 'nullable|string|max:20',
            'manager_name' => 'nullable|string|max:255',
            'is_active' => 'nullable|boolean',
            'map_embed_url' => 'nullable|string|max:2048',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
        ];
    }
}
