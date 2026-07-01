<?php

namespace App\Modules\Pricing\Http\Resources;

use App\Modules\Pricing\Models\FeatureDefinition;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin FeatureDefinition */
class FeatureDefinitionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'key' => $this->key,
            'label' => $this->label,
            'description' => $this->description,
            'type' => $this->type,
            'default_value' => $this->default_value,
            'category' => $this->category,
            'sort_order' => $this->sort_order,
        ];
    }
}
