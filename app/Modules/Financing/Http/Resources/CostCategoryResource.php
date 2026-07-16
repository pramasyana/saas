<?php

declare(strict_types=1);

namespace App\Modules\Financing\Http\Resources;

use App\Modules\Financing\Models\CostCategory;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin CostCategory */
class CostCategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'color' => $this->color,
            'sort_order' => $this->sort_order,
            'costs_count' => $this->when(isset($this->costs_count), $this->costs_count),
            'costs_sum_amount' => $this->when(isset($this->costs_sum_amount), (float) $this->costs_sum_amount),
            'created_at' => $this->created_at?->format('d M Y'),
        ];
    }
}
