<?php

declare(strict_types=1);

use App\Modules\Booking\Http\Controllers\Public\BookingController;
use App\Modules\Booking\Http\Controllers\Public\LandingController;
use Illuminate\Support\Facades\Route;

Route::get('/', [LandingController::class, 'index']);
Route::get('/booking', [BookingController::class, 'index']);
Route::get('/booking/{code}/confirmation', [BookingController::class, 'confirmation']);
