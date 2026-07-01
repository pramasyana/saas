<?php

namespace App\Modules\Subscription\Services;

use App\Modules\Pricing\Models\Plan;
use App\Modules\Subscription\Contracts\SubscriptionRepositoryInterface;
use App\Modules\Subscription\Models\Subscription;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class SubscriptionService
{
    public function __construct(
        private readonly SubscriptionRepositoryInterface $subscriptionRepository,
        private readonly InvoiceService $invoiceService,
    ) {}

    public function paginate(array $filters = [], int $perPage = 15): mixed
    {
        return $this->subscriptionRepository->paginate($filters, $perPage);
    }

    public function findById(string $id): Subscription
    {
        $subscription = $this->subscriptionRepository->findById($id);
        if (! $subscription) {
            throw new RuntimeException('Subscription tidak ditemukan.');
        }
        return $subscription;
    }

    public function subscribe(array $data): Subscription
    {
        return DB::transaction(function () use ($data) {
            $plan = Plan::findOrFail($data['plan_id']);

            $snapshot = [];
            foreach ($plan->features as $feature) {
                $snapshot[] = [
                    'key' => $feature->definition->key,
                    'label' => $feature->definition->label,
                    'type' => $feature->definition->type,
                    'value' => $feature->value,
                ];
            }

            $interval = $data['billing_interval'] ?? 'monthly';
            $priceAmount = $interval === 'yearly' && $plan->price_yearly
                ? $plan->price_yearly
                : $plan->price_monthly;

            $subscription = $this->subscriptionRepository->create([
                'user_id' => $data['user_id'],
                'plan_id' => $plan->id,
                'price_amount' => $priceAmount,
                'billing_interval' => $interval,
                'features_snapshot' => $snapshot,
                'status' => 'active',
                'starts_at' => now(),
                'ends_at' => $interval === 'yearly' ? now()->addYear() : now()->addMonth(),
                'trial_ends_at' => null,
            ]);

            $this->invoiceService->generate($subscription);

            Log::info('Subscription created', [
                'subscription_id' => $subscription->id,
                'user_id' => $subscription->user_id,
                'plan_id' => $plan->id,
                'price_amount' => $priceAmount,
                'interval' => $interval,
            ]);

            return $subscription->load(['user', 'plan', 'invoices']);
        });
    }

    public function cancel(string $id, ?string $reason = null): Subscription
    {
        return DB::transaction(function () use ($id, $reason) {
            $subscription = $this->findById($id);

            if ($subscription->status !== 'active') {
                throw new RuntimeException('Hanya subscription aktif yang bisa dibatalkan.');
            }

            $subscription = $this->subscriptionRepository->update($subscription, [
                'status' => 'cancelled',
                'cancelled_at' => now(),
                'ends_at' => now(),
            ]);

            Log::info('Subscription cancelled', [
                'subscription_id' => $subscription->id,
                'reason' => $reason,
            ]);

            return $subscription;
        });
    }
}
