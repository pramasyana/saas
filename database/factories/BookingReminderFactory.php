<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Modules\Booking\Models\Booking;
use App\Modules\Booking\Models\BookingReminder;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class BookingReminderFactory extends Factory
{
    protected $model = BookingReminder::class;

    public function definition(): array
    {
        return [
            'id' => (string) Str::uuid(),
            'booking_id' => Booking::factory(),
            'type' => 'email',
            'status' => 'pending',
            'scheduled_at' => now()->addHours(23),
        ];
    }

    public function sent(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'sent',
            'sent_at' => now(),
        ]);
    }

    public function failed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'failed',
            'error_message' => 'Failed to send',
        ]);
    }
}
