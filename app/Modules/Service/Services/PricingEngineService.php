<?php

declare(strict_types=1);

namespace App\Modules\Service\Services;

use App\Modules\Service\Contracts\PricingRuleRepositoryInterface;
use App\Modules\Service\Models\PricingRule;
use Illuminate\Support\Collection;

class PricingEngineService
{
    public function __construct(
        private readonly PricingRuleRepositoryInterface $pricingRuleRepository,
    ) {}

    public function calculate(array $input): array
    {
        $tenantId = auth()->user()->tenant_id;
        $rules = $this->pricingRuleRepository->getActiveRules($tenantId);

        $results = [];

        foreach ($input['items'] as $item) {
            $originalPrice = (float) ($item['price'] ?? 0);
            $adjustedPrice = $originalPrice;
            $appliedRules = [];

            foreach ($rules as $rule) {
                if (! $this->matchesRule($rule, $item, $input)) {
                    continue;
                }

                $newPrice = $this->applyRule($rule, $adjustedPrice);
                $appliedRules[] = [
                    'id' => $rule->id,
                    'name' => $rule->name,
                    'action_type' => $rule->action_type,
                    'value' => (float) $rule->value,
                    'original_price' => $originalPrice,
                    'price_before' => $adjustedPrice,
                    'price_after' => $newPrice,
                ];
                $adjustedPrice = $newPrice;
            }

            $results[] = [
                'id' => $item['id'] ?? null,
                'type' => $item['type'] ?? 'service',
                'original_price' => $originalPrice,
                'adjusted_price' => $adjustedPrice,
                'discount' => $originalPrice - $adjustedPrice,
                'applied_rules' => $appliedRules,
            ];
        }

        return [
            'items' => $results,
            'subtotal' => collect($results)->sum('original_price'),
            'total' => collect($results)->sum('adjusted_price'),
            'total_discount' => collect($results)->sum('discount'),
        ];
    }

    private function matchesRule(PricingRule $rule, array $item, array $input): bool
    {
        $conditions = $rule->conditions;

        // Check apply_to
        if (! empty($conditions['apply_to'])) {
            $itemType = $item['type'] ?? 'service';
            if (! in_array($itemType, (array) $conditions['apply_to'], true)) {
                return false;
            }
        }

        // Check category_ids
        if (! empty($conditions['category_ids'])) {
            $categoryId = $item['category_id'] ?? null;
            if ($categoryId === null || ! in_array($categoryId, $conditions['category_ids'], true)) {
                return false;
            }
        }

        // Check service_ids
        if (! empty($conditions['service_ids'])) {
            $itemId = $item['id'] ?? null;
            if ($itemId === null || ! in_array($itemId, $conditions['service_ids'], true)) {
                return false;
            }
        }

        // Check branch_ids
        if (! empty($conditions['branch_ids'])) {
            $branchId = $input['branch_id'] ?? null;
            if ($branchId === null || ! in_array($branchId, $conditions['branch_ids'], true)) {
                return false;
            }
        }

        // Check staff_ids
        if (! empty($conditions['staff_ids'])) {
            $staffId = $input['staff_id'] ?? null;
            if ($staffId === null || ! in_array($staffId, $conditions['staff_ids'], true)) {
                return false;
            }
        }

        // Check days_of_week
        if (! empty($conditions['days_of_week'])) {
            $dayOfWeek = (int) now()->format('N'); // 1=Mon, 7=Sun
            if (! in_array($dayOfWeek, $conditions['days_of_week'], true)) {
                return false;
            }
        }

        // Check time range
        if (! empty($conditions['time_start']) || ! empty($conditions['time_end'])) {
            $currentTime = now()->format('H:i');
            if (! empty($conditions['time_start']) && $currentTime < $conditions['time_start']) {
                return false;
            }
            if (! empty($conditions['time_end']) && $currentTime > $conditions['time_end']) {
                return false;
            }
        }

        // Check min/max price
        if (! empty($conditions['min_price'])) {
            $price = (float) ($item['price'] ?? 0);
            if ($price < (float) $conditions['min_price']) {
                return false;
            }
        }

        if (! empty($conditions['max_price'])) {
            $price = (float) ($item['price'] ?? 0);
            if ($price > (float) $conditions['max_price']) {
                return false;
            }
        }

        return true;
    }

    private function applyRule(PricingRule $rule, float $currentPrice): float
    {
        return match ($rule->action_type) {
            'percentage_discount' => $currentPrice - ($currentPrice * (float) $rule->value / 100),
            'fixed_discount' => max(0, $currentPrice - (float) $rule->value),
            'percentage_surcharge' => $currentPrice + ($currentPrice * (float) $rule->value / 100),
            'fixed_surcharge' => $currentPrice + (float) $rule->value,
            'price_override' => (float) $rule->value,
            default => $currentPrice,
        };
    }
}
