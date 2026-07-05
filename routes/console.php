<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('bookings:send-reminders')
    ->everyMinute()
    ->description('Send pending booking reminders');

Schedule::command('booking:generate-recurring')
    ->everyMinute()
    ->description('Generate recurring bookings from active templates');

Schedule::command('email-logs:clear-old')
    ->monthlyOn(1, '00:00')
    ->description('Hapus email logs yang lebih dari 3 bulan');
