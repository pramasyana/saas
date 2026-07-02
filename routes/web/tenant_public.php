<?php

declare(strict_types=1);

use App\Modules\Booking\Http\Controllers\Public\BookingController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => redirect('/booking'));
Route::get('/booking', [BookingController::class, 'index']);
Route::get('/booking/{code}/confirmation', [BookingController::class, 'confirmation']);
