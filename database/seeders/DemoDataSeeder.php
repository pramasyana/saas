<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Modules\Booking\Models\Booking;
use App\Modules\Booking\Models\BookingService;
use App\Modules\Company\Models\Branch;
use App\Modules\Crm\Models\Customer;
use App\Modules\Crm\Models\CustomerMembershipPlan;
use App\Modules\Crm\Models\CustomerSubscription;
use App\Modules\Service\Models\Service;
use App\Modules\Staff\Models\Staff;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DemoDataSeeder extends Seeder
{
    public function run(?string $tenantId = null, ?string $branchId = null): void
    {
        $tenantId ??= tenant('id');
        $branchId ??= Branch::where('tenant_id', $tenantId)->where('is_default', true)->first()?->id;

        if (! $tenantId || ! $branchId) {
            return;
        }

        $this->seedRooms($tenantId, $branchId);
        $this->seedCustomers($tenantId);
        $this->seedMembershipPlans($tenantId);
        $this->seedCustomerSubscriptions($tenantId);
        $this->seedBookings($tenantId, $branchId);
    }

    private function seedRooms(string $tenantId, string $branchId): void
    {
        $rooms = [
            ['name' => 'VIP Room', 'description' => 'Ruangan VIP premium dengan fasilitas lengkap', 'color' => '#7C3AED', 'capacity' => 2],
            ['name' => 'Standard Room', 'description' => 'Ruangan standar nyaman untuk perawatan', 'color' => '#3B82F6', 'capacity' => 1],
            ['name' => 'Suite Room', 'description' => 'Ruangan suite mewah dengan pemandangan', 'color' => '#EC4899', 'capacity' => 3],
            ['name' => 'Relaxation Room', 'description' => 'Ruangan relaksasi dengan suasana tenang', 'color' => '#10B981', 'capacity' => 1],
        ];

        foreach ($rooms as $room) {
            DB::table('rooms')->insert([
                'id' => (string) Str::uuid(),
                'tenant_id' => $tenantId,
                'branch_id' => $branchId,
                'name' => $room['name'],
                'description' => $room['description'],
                'color' => $room['color'],
                'capacity' => $room['capacity'],
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    private function seedCustomers(string $tenantId): void
    {
        $customers = [
            ['name' => 'Siti Rahayu', 'email' => 'siti@example.com', 'phone' => '081234567890', 'is_active' => true],
            ['name' => 'Budi Santoso', 'email' => 'budi@example.com', 'phone' => '081234567891', 'is_active' => true],
            ['name' => 'Dewi Lestari', 'email' => 'dewi@example.com', 'phone' => '081234567892', 'is_active' => true],
            ['name' => 'Rudi Hermawan', 'email' => 'rudi@example.com', 'phone' => '081234567893', 'is_active' => true],
            ['name' => 'Ani Wulandari', 'email' => 'ani@example.com', 'phone' => '081234567894', 'is_active' => true],
            ['name' => 'Agus Pratama', 'email' => 'agus@example.com', 'phone' => '081234567895', 'is_active' => true],
            ['name' => 'Rina Marlina', 'email' => 'rina@example.com', 'phone' => '081234567896', 'is_active' => true],
            ['name' => 'Doni Kusuma', 'email' => 'doni@example.com', 'phone' => '081234567897', 'is_active' => true],
            ['name' => 'Mega Sari', 'email' => 'mega@example.com', 'phone' => '081234567898', 'is_active' => true],
            ['name' => 'Tono Wijaya', 'email' => 'tono@example.com', 'phone' => '081234567899', 'is_active' => true],
            ['name' => 'Fitri Handayani', 'email' => 'fitri@example.com', 'phone' => '081234567800', 'is_active' => true],
            ['name' => 'Eko Prasetyo', 'email' => 'eko@example.com', 'phone' => '081234567801', 'is_active' => false],
        ];

        foreach ($customers as $cust) {
            Customer::create([
                'tenant_id' => $tenantId,
                'name' => $cust['name'],
                'email' => $cust['email'],
                'phone' => $cust['phone'],
                'is_active' => $cust['is_active'],
            ]);
        }
    }

    private function seedMembershipPlans(string $tenantId): void
    {
        $plans = [
            [
                'name' => 'Basic Monthly',
                'description' => 'Akses dasar untuk layanan reguler',
                'price' => 150000,
                'billing_interval' => 'monthly',
                'duration_months' => 1,
                'benefits' => ['Diskon 10% semua layanan', 'Prioritas booking'],
                'sort_order' => 1,
            ],
            [
                'name' => 'Premium Monthly',
                'description' => 'Nikmati layanan premium dengan harga spesial',
                'price' => 350000,
                'billing_interval' => 'monthly',
                'duration_months' => 1,
                'benefits' => ['Diskon 20% semua layanan', 'Free add-on setiap booking', 'Prioritas booking', 'Akses ruang VIP'],
                'sort_order' => 2,
            ],
            [
                'name' => 'Annual VIP',
                'description' => 'Langganan tahunan dengan benefit maksimal',
                'price' => 3000000,
                'billing_interval' => 'yearly',
                'duration_months' => 12,
                'benefits' => ['Diskon 30% semua layanan', 'Free add-on unlimited', 'Prioritas booking', 'Akses ruang VIP', 'Free 1x treatment per bulan', 'Voucher ulang tahun Rp 500,000'],
                'sort_order' => 3,
            ],
        ];

        foreach ($plans as $plan) {
            CustomerMembershipPlan::create([
                'tenant_id' => $tenantId,
                'name' => $plan['name'],
                'description' => $plan['description'],
                'price' => $plan['price'],
                'billing_interval' => $plan['billing_interval'],
                'duration_months' => $plan['duration_months'],
                'benefits' => $plan['benefits'],
                'is_active' => true,
                'sort_order' => $plan['sort_order'],
            ]);
        }
    }

    private function seedCustomerSubscriptions(string $tenantId): void
    {
        $customers = Customer::where('tenant_id', $tenantId)->get();
        $plans = CustomerMembershipPlan::where('tenant_id', $tenantId)->get();

        if ($plans->isEmpty() || $customers->isEmpty()) {
            return;
        }

        $subscriptions = [
            ['customer' => $customers[0], 'plan' => $plans[1], 'status' => 'active', 'months' => 2], // Siti -> Premium
            ['customer' => $customers[1], 'plan' => $plans[0], 'status' => 'active', 'months' => 1], // Budi -> Basic
            ['customer' => $customers[2], 'plan' => $plans[2], 'status' => 'active', 'months' => 4], // Dewi -> Annual
            ['customer' => $customers[4], 'plan' => $plans[0], 'status' => 'active', 'months' => 3], // Ani -> Basic
            ['customer' => $customers[6], 'plan' => $plans[1], 'status' => 'cancelled', 'months' => 1], // Rina -> cancelled
        ];

        foreach ($subscriptions as $sub) {
            $startDate = now()->subMonths($sub['months']);
            $endDate = $startDate->copy()->addMonths($sub['plan']->duration_months);

            CustomerSubscription::create([
                'tenant_id' => $tenantId,
                'customer_id' => $sub['customer']->id,
                'plan_id' => $sub['plan']->id,
                'plan_name' => $sub['plan']->name,
                'price_amount' => $sub['plan']->price,
                'billing_interval' => $sub['plan']->billing_interval,
                'benefits_snapshot' => $sub['plan']->benefits,
                'status' => $sub['status'],
                'start_date' => $startDate,
                'end_date' => $endDate,
                'cancelled_at' => $sub['status'] === 'cancelled' ? now()->subMonth() : null,
            ]);
        }
    }

    private function seedBookings(string $tenantId, string $branchId): void
    {
        $customers = Customer::where('tenant_id', $tenantId)->where('is_active', true)->get();
        $staff = Staff::where('tenant_id', $tenantId)->get();
        $services = Service::where('tenant_id', $tenantId)->get();
        $rooms = DB::table('rooms')->where('tenant_id', $tenantId)->get();

        if ($customers->isEmpty() || $staff->isEmpty() || $services->isEmpty()) {
            return;
        }

        $statuses = ['completed', 'completed', 'completed', 'confirmed', 'cancelled'];
        $sources = ['online', 'walkin', 'staff'];

        for ($i = 0; $i < 15; $i++) {
            $customer = $customers->random();
            $staffMember = $staff->random();
            $service = $services->random();
            $room = $rooms->isNotEmpty() ? $rooms->random() : null;
            $daysAgo = rand(0, 14);
            $hour = rand(9, 16);
            $startTime = Carbon::now()->subDays($daysAgo)->setHour($hour)->setMinute(0)->setSecond(0);
            $duration = $service->duration ?? 60;
            $endTime = $startTime->copy()->addMinutes((int) $duration);
            $status = $statuses[array_rand($statuses)];

            DB::transaction(function () use ($tenantId, $branchId, $customer, $staffMember, $service, $room, $startTime, $endTime, $duration, $status) {
                $booking = Booking::create([
                    'tenant_id' => $tenantId,
                    'branch_id' => $branchId,
                    'customer_id' => $customer->id,
                    'staff_id' => $staffMember->id,
                    'start_time' => $startTime,
                    'end_time' => $endTime,
                    'duration_minutes' => (int) $duration,
                    'status' => $status,
                    'source' => 'online',
                    'booking_code' => 'BK-' . strtoupper(Str::random(8)),
                ]);

                BookingService::create([
                    'booking_id' => $booking->id,
                    'name' => $service->name,
                    'price' => $service->price,
                    'duration' => $service->duration ?? $duration,
                    'quantity' => 1,
                ]);

                if ($room) {
                    DB::table('booking_rooms')->insert([
                        'id' => (string) Str::uuid(),
                        'booking_id' => $booking->id,
                        'room_id' => $room->id,
                        'start_time' => $startTime,
                        'end_time' => $endTime,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            });
        }
    }
}
