<?php

namespace App\Modules\Pricing\Http\Resources;

use App\Modules\Pricing\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Plan */
class PlanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'price_monthly' => (float) $this->price_monthly,
            'price_yearly' => $this->price_yearly ? (float) $this->price_yearly : null,
            'is_active' => $this->is_active,
            'is_popular' => $this->is_popular,
            'sort_order' => $this->sort_order,
            'features' => $this->whenLoaded('features', function () {
                return $this->features->map(function ($feature) {
                    return [
                        'id' => $feature->id,
                        'feature_definition_id' => $feature->feature_definition_id,
                        'value' => $feature->value,
                        'definition' => [
                            'id' => $feature->definition->id,
                            'key' => $feature->definition->key,
                            'label' => $feature->definition->label,
                            'type' => $feature->definition->type,
                            'description' => $feature->definition->description,
                            'category' => $feature->definition->category,
                            'sort_order' => $feature->definition->sort_order,
                        ],
                    ];
                });
            }),
            'created_at' => $this->created_at?->diffForHumans(),
        ];
    }
}
