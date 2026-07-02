<?php

declare(strict_types=1);

namespace App\Modules\Service\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePricingRuleRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'branch_id' => 'required|string|exists:branches,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'action_type' => 'required|string|in:percentage_discount,fixed_discount,percentage_surcharge,fixed_surcharge,price_override',
            'value' => 'required|numeric|min:0|max:999999999.99',
            'conditions' => 'required|array',
            'conditions.apply_to' => 'nullable|array',
            'conditions.apply_to.*' => 'string|in:service,package,addon',
            'conditions.category_ids' => 'nullable|array',
            'conditions.category_ids.*' => 'string',
            'conditions.service_ids' => 'nullable|array',
            'conditions.service_ids.*' => 'string',
            'conditions.package_ids' => 'nullable|array',
            'conditions.package_ids.*' => 'string',
            'conditions.addon_ids' => 'nullable|array',
            'conditions.addon_ids.*' => 'string',
            'conditions.branch_ids' => 'nullable|array',
            'conditions.branch_ids.*' => 'string',
            'conditions.staff_ids' => 'nullable|array',
            'conditions.staff_ids.*' => 'string',
            'conditions.days_of_week' => 'nullable|array',
            'conditions.days_of_week.*' => 'integer|between:1,7',
            'conditions.time_start' => 'nullable|string|date_format:H:i',
            'conditions.time_end' => 'nullable|string|date_format:H:i',
            'conditions.min_price' => 'nullable|numeric|min:0',
            'conditions.max_price' => 'nullable|numeric|min:0',
            'priority' => 'nullable|integer|min:0|max:9999',
            'is_active' => 'boolean',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ];
    }
}
