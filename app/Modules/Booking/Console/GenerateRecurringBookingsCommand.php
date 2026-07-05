<?php

declare(strict_types=1);

namespace App\Modules\Booking\Console;

use App\Modules\Booking\Contracts\BookingRepositoryInterface;
use App\Modules\Booking\Contracts\BookingStatusLogRepositoryInterface;
use App\Modules\Booking\Events\BookingCreated;
use App\Modules\Booking\Models\BookingRecurringTemplate;
use App\Modules\Setting\Services\TenantSettingService;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class GenerateRecurringBookingsCommand extends Command
{
    protected $signature = 'booking:generate-recurring';

    protected $description = 'Generate recurring bookings from active templates';

    public function __construct(
        private readonly BookingRepositoryInterface $bookingRepository,
        private readonly BookingStatusLogRepositoryInterface $statusLogRepository,
    ) {
        parent::__construct();
    }

    public function handle(): int
    {
        $settings = app(TenantSettingService::class);

        if (! $settings->get('recurring.enabled', true)) {
            $this->info('Recurring generation is disabled via settings.');

            return Command::SUCCESS;
        }

        $generateAt = $settings->get('recurring.generate_at', '03:00');
        $generateInterval = (int) $settings->get('recurring.generate_interval', 1);

        $now = now();
        if ($now->format('H:i') !== $generateAt) {
            return Command::SUCCESS;
        }

        if ($now->dayOfYear % $generateInterval !== 0) {
            return Command::SUCCESS;
        }

        $today = $now->startOfDay();

        $templates = BookingRecurringTemplate::where('is_active', true)
            ->where('next_generation_date', '<=', $today)
            ->with('sourceBooking')
            ->get();

        if ($templates->isEmpty()) {
            $this->info('No recurring templates to process.');

            return Command::SUCCESS;
        }

        $generated = 0;

        foreach ($templates as $template) {
            $source = $template->sourceBooking;
            if (! $source) {
                continue;
            }

            $generationDate = Carbon::parse($template->next_generation_date);

            $startTime = $generationDate->copy()->setTimeFromTimeString($source->start_time->format('H:i:s'));
            $endTime = $generationDate->copy()->setTimeFromTimeString($source->end_time->format('H:i:s'));

            DB::transaction(function () use ($source, $startTime, $endTime, $template, &$generated) {
                $booking = $this->bookingRepository->create([
                    'tenant_id' => $source->tenant_id,
                    'branch_id' => $source->branch_id,
                    'customer_id' => $source->customer_id,
                    'staff_id' => $source->staff_id,
                    'start_time' => $startTime,
                    'end_time' => $endTime,
                    'duration_minutes' => $source->duration_minutes,
                    'status' => 'pending',
                    'source' => 'recurring',
                    'notes' => $source->notes,
                    'total_guests' => $source->total_guests ?? 1,
                    'recurring_template_id' => $template->id,
                ]);

                $this->statusLogRepository->create([
                    'booking_id' => $booking->id,
                    'from_status' => null,
                    'to_status' => 'pending',
                    'changed_by' => 'system',
                ]);

                foreach ($source->services as $svc) {
                    $booking->services()->create($svc->toArray());
                }

                event(new BookingCreated($booking));

                $generated++;
            });

            $template->increment('occurrences_generated');

            // Calculate next generation date
            $nextDate = $this->calculateNextDate($generationDate, $template);
            $template->next_generation_date = $nextDate;

            // Check if template should be deactivated
            if ($template->end_type === 'after_count' && $template->occurrences_generated >= $template->count) {
                $template->is_active = false;
            } elseif ($template->end_type === 'until_date' && $nextDate->greaterThan(Carbon::parse($template->until_date))) {
                $template->is_active = false;
            }

            $template->save();
        }

        $this->info("Generated {$generated} recurring booking(s).");

        return Command::SUCCESS;
    }

    private function calculateNextDate(Carbon $current, BookingRecurringTemplate $template): Carbon
    {
        return match ($template->frequency) {
            'daily' => $current->addDays($template->interval),
            'weekly' => $current->addWeeks($template->interval),
            'monthly' => $current->addMonths($template->interval),
            default => $current->addDays($template->interval),
        };
    }
}
