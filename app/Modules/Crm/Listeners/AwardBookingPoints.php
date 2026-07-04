<?php

declare(strict_types=1);

namespace App\Modules\Crm\Listeners;

use App\Modules\Booking\Events\BookingCompleted;
use App\Modules\Crm\Contracts\LoyaltyTransactionRepositoryInterface;
use App\Modules\Crm\Contracts\MembershipRepositoryInterface;
use App\Modules\Crm\Contracts\MembershipTierRepositoryInterface;
use App\Modules\Crm\Models\Membership;
use Illuminate\Support\Facades\DB;

class AwardBookingPoints
{
    private const DEFAULT_CONFIG = [
        'enabled' => true,
        'mode' => 'percentage',
        'points_per_amount' => 1000,
        'points_fixed' => 10,
    ];

    public function __construct(
        private readonly LoyaltyTransactionRepositoryInterface $transactionRepository,
        private readonly MembershipRepositoryInterface $membershipRepository,
        private readonly MembershipTierRepositoryInterface $tierRepository,
    ) {}

    public function handle(BookingCompleted $event): void
    {
        $booking = $event->booking;

        $config = tenant()->getInternal('loyalty_config') ?? [];
        $config = array_merge(self::DEFAULT_CONFIG, $config);

        if (! ($config['enabled'] ?? false)) {
            return;
        }

        $totalPrice = (int) $booking->services()->sum(
            DB::raw('price * quantity')
        );

        if ($totalPrice <= 0) {
            return;
        }

        $points = match ($config['mode']) {
            'fixed' => (int) ($config['points_fixed'] ?? 10),
            default => (int) floor($totalPrice / ($config['points_per_amount'] ?? 1000)),
        };

        if ($points <= 0) {
            return;
        }

        DB::transaction(function () use ($booking, $points, $totalPrice): void {
            $membership = $this->membershipRepository->findByCustomer($booking->customer_id);

            if (! $membership) {
                $membership = $this->membershipRepository->create([
                    'tenant_id' => $booking->tenant_id,
                    'customer_id' => $booking->customer_id,
                    'points' => 0,
                    'total_spent' => 0,
                    'joined_at' => now(),
                ]);
            }

            $this->transactionRepository->create([
                'tenant_id' => $booking->tenant_id,
                'customer_id' => $booking->customer_id,
                'type' => 'earn',
                'points' => $points,
                'description' => 'Poin dari booking #' . $booking->booking_code,
                'reference_type' => 'booking',
                'reference_id' => $booking->id,
            ]);

            $this->membershipRepository->update($membership, [
                'points' => $membership->points + $points,
                'total_spent' => $membership->total_spent + $totalPrice,
            ]);

            $this->syncTier($membership->fresh());
        });
    }

    private function syncTier(Membership $membership): void
    {
        $tiers = $this->tierRepository->findAllByTenant($membership->tenant_id);

        $highestTier = $tiers
            ->where('is_active', true)
            ->sortByDesc('min_points')
            ->first(fn ($t) => $membership->points >= $t->min_points);

        if ($highestTier && $membership->membership_tier_id !== $highestTier->id) {
            $this->membershipRepository->update($membership, [
                'membership_tier_id' => $highestTier->id,
            ]);
        }
    }
}
