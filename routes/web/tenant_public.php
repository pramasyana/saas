<?php

declare(strict_types=1);

use App\Modules\Booking\Http\Controllers\Public\BookingController;
use App\Modules\Booking\Http\Controllers\Public\LandingController;
use Illuminate\Support\Facades\Route;

// Domain-aware GET /: central → marketing, tenant → tenant landing.
// tenant.domain.public middleware already ran — tenancy is initialized on
// tenant domains, null on central domains.
Route::get('/', function () {
    if (tenant()) {
        return app(LandingController::class)->index();
    }

    return app(\App\Modules\Admin\Http\Controllers\LandingController::class)->index();
})->name('home');

Route::get('/booking', [BookingController::class, 'index']);
Route::get('/booking/{code}/confirmation', [BookingController::class, 'confirmation']);
