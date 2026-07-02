<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Modules\Booking\Models\Booking;
use App\Modules\Company\Models\Branch;
use App\Modules\Crm\Models\Customer;
use App\Modules\Staff\Models\Staff;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class BookingFactory extends Factory
{
    protected $model = Booking::class;

    public function definition(): array
    {
        $start = now()->addDays(rand(0, 30))->setHour(rand(8, 17))->setMinute(0);
        $duration = rand(1, 4) * 30;

        return [
            'id' => (string) Str::uuid(),
            'branch_id' => Branch::factory(),
            'customer_id' => Customer::factory(),
            'staff_id' => Staff::factory(),
            'start_time' => $start,
            'end_time' => $start->copy()->addMinutes($duration),
            'duration_minutes' => $duration,
            'status' => 'confirmed',
            'source' => 'online',
            'booking_code' => 'BK-'.now()->format('Ymd').'-'.str_pad((string) rand(1, 999), 3, '0', STR_PAD_LEFT),
        ];
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }

    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
        ]);
    }

    public function walkIn(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'confirmed',
            'source' => 'walk_in',
        ]);
    }
}
