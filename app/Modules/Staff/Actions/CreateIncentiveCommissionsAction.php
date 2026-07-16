<?php

declare(strict_types=1);

namespace App\Modules\Staff\Actions;

use App\Modules\Booking\Models\Booking;
use App\Modules\Staff\Models\Commission;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CreateIncentiveCommissionsAction
{
    public function execute(Booking $booking): array
    {
        $tenantId = tenant()->getTenantKey();

        $services = $booking->services()
            ->with('staff')
            ->get()
            ->filter(fn ($s) => ! empty($s->staff_id));

        if ($services->isEmpty()) {
            return [];
        }

        $staffIds = $services->pluck('staff_id')->unique()->values()->all();

        $pivots = DB::table('staff_service')
            ->where('tenant_id', $tenantId)
            ->whereIn('staff_id', $staffIds)
            ->get()
            ->keyBy(fn ($p) => "{$p->staff_id}_{$p->service_id}");

        $commissions = [];
        $now = now();

        DB::transaction(function () use ($services, $pivots, $tenantId, $booking, $now, &$commissions) {
            foreach ($services as $svc) {
                $pivotKey = "{$svc->staff_id}_{$svc->service_id}";
                $pivot = $pivots->get($pivotKey);

                if (! $pivot || (float) $pivot->commission_percentage <= 0) {
                    continue;
                }

                $lineTotal = (float) $svc->price * (int) $svc->quantity;
                $amount = round($lineTotal * (float) $pivot->commission_percentage / 100, 2);

                if ($amount <= 0) {
                    continue;
                }

                $commission = Commission::create([
                    'id' => (string) Str::uuid(),
                    'tenant_id' => $tenantId,
                    'staff_id' => $svc->staff_id,
                    'booking_id' => $booking->id,
                    'amount' => $amount,
                    'type' => 'incentive',
                    'date' => $now->format('Y-m-d'),
                    'notes' => "Incentive: {$svc->name} ({$pivot->commission_percentage}%)",
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);

                $commissions[] = $commission;
            }
        });

        return $commissions;
    }
}
