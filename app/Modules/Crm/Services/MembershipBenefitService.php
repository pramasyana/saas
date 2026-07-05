<?php

declare(strict_types=1);

namespace App\Modules\Crm\Services;

use App\Modules\Crm\Models\CustomerSubscription;
use App\Modules\Crm\Models\Membership;

class MembershipBenefitService
{
    private const DEFAULT_BENEFITS = [
        'discount_percent' => 0,
        'priority_booking' => false,
        'free_add_on' => false,
        'vip_access' => false,
    ];

    public function getCustomerBenefits(string $customerId, ?string $tenantId = null): array
    {
        $benefits = self::DEFAULT_BENEFITS;

        $subscription = CustomerSubscription::where('customer_id', $customerId)
            ->where('status', 'active')
            ->where(function ($q) {
                $q->whereNull('start_date')->orWhere('start_date', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('end_date')->orWhere('end_date', '>=', now());
            })
            ->first();

        if ($subscription && $subscription->benefits_snapshot) {
            $benefits = $this->mergeBenefits(
                $benefits,
                $this->parseBenefits($subscription->benefits_snapshot),
            );
        }

        $membership = Membership::with('tier')
            ->where('customer_id', $customerId)
            ->first();

        if ($membership?->tier?->benefits) {
            $benefits = $this->mergeBenefits(
                $benefits,
                $this->parseBenefits($membership->tier->benefits),
            );
        }

        return $benefits;
    }

    public function hasActiveSubscription(string $customerId): bool
    {
        return CustomerSubscription::where('customer_id', $customerId)
            ->where('status', 'active')
            ->where(function ($q) {
                $q->whereNull('start_date')->orWhere('start_date', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('end_date')->orWhere('end_date', '>=', now());
            })
            ->exists();
    }

    private function parseBenefits(array|string $benefits): array
    {
        if (is_string($benefits)) {
            $benefits = json_decode($benefits, true) ?? [];
        }

        if (! is_array($benefits)) {
            return [];
        }

        if (array_keys($benefits) !== range(0, count($benefits) - 1)) {
            return array_merge(self::DEFAULT_BENEFITS, $benefits);
        }

        $result = self::DEFAULT_BENEFITS;

        foreach ($benefits as $benefit) {
            if (! is_string($benefit)) {
                continue;
            }

            $lower = mb_strtolower($benefit);

            if (preg_match('/diskon\s*(\d+)/i', $benefit, $m)) {
                $result['discount_percent'] = max($result['discount_percent'], (int) $m[1]);
            }
            if (str_contains($lower, 'prioritas')) {
                $result['priority_booking'] = true;
            }
            if (str_contains($lower, 'free add-on') || str_contains($lower, 'gratis')) {
                $result['free_add_on'] = true;
            }
            if (str_contains($lower, 'vip') || str_contains($lower, 'ruang')) {
                $result['vip_access'] = true;
            }
        }

        return $result;
    }

    private function mergeBenefits(array $current, array $incoming): array
    {
        return [
            'discount_percent' => max(
                (int) ($current['discount_percent'] ?? 0),
                (int) ($incoming['discount_percent'] ?? 0),
            ),
            'priority_booking' => ($current['priority_booking'] ?? false) || ($incoming['priority_booking'] ?? false),
            'free_add_on' => ($current['free_add_on'] ?? false) || ($incoming['free_add_on'] ?? false),
            'vip_access' => ($current['vip_access'] ?? false) || ($incoming['vip_access'] ?? false),
        ];
    }
}
