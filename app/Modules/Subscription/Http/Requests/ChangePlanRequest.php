<?php

namespace App\Modules\Subscription\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ChangePlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'plan_id' => 'required|exists:plans,id',
            'billing_interval' => 'nullable|in:monthly,yearly',
        ];
    }
}
