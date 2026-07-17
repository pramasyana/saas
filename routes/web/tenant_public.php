<?php

declare(strict_types=1);

use App\Modules\Booking\Http\Controllers\Public\BookingController;
use App\Modules\Booking\Http\Controllers\Public\LandingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Domain-aware GET /: central → marketing, tenant → tenant landing.
// tenant.domain.public middleware already ran — tenancy is initialized on
// tenant domains, null on central domains.
Route::get('/', function (Request $request) {
    if (tenant()) {
        return app(LandingController::class)->index($request);
    }

    return app(\App\Modules\Admin\Http\Controllers\LandingController::class)->index();
})->name('home');

Route::get('/book', [BookingController::class, 'index']);
Route::get('/book/{code}/confirmation', [BookingController::class, 'confirmation']);