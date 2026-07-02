<?php

declare(strict_types=1);

use App\Modules\Booking\Http\Controllers\Api\AvailabilityController;
use App\Modules\Booking\Http\Controllers\Api\BookingController;
use App\Modules\Booking\Http\Controllers\Api\CalendarController;
use App\Modules\Booking\Http\Controllers\Api\WaitingListController;
use App\Modules\Booking\Http\Controllers\Api\WalkInController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    // Calendar
    Route::get('/booking/calendar', [CalendarController::class, 'index']);

    // Availability
    Route::get('/booking/availability', [AvailabilityController::class, 'check']);

    // Bookings
    Route::get('/booking/stats', [BookingController::class, 'stats']);
    Route::post('/booking/bookings/{id}/reschedule', [BookingController::class, 'reschedule']);
    Route::post('/booking/bookings/{id}/no-show', [BookingController::class, 'noShow']);
    Route::post('/booking/bookings/{id}/check-in', [BookingController::class, 'checkIn']);
    Route::post('/booking/bookings/{id}/complete', [BookingController::class, 'complete']);
    Route::post('/booking/bookings/{id}/cancel', [BookingController::class, 'cancel']);
    Route::apiResource('/booking/bookings', BookingController::class)->except(['edit', 'create']);

    // Walk In
    Route::post('/booking/walk-in', [WalkInController::class, 'store']);

    // Waiting List
    Route::post('/booking/waiting-list/{id}/notify', [WaitingListController::class, 'notify']);
    Route::apiResource('/booking/waiting-list', WaitingListController::class)->except(['edit', 'create']);
});
