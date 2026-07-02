<?php

declare(strict_types=1);

namespace App\Modules\Crm\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReferralRequest extends FormRequest
{
    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'referrer_customer_id' => 'required|string|exists:customers,id',
            'referred_name' => 'nullable|string|max:255',
            'referred_email' => 'nullable|email|max:255',
        ];
    }
}
