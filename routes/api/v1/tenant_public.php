<?php

declare(strict_types=1);

use App\Modules\Booking\Http\Controllers\Api\Public\PublicAvailabilityController;
use App\Modules\Booking\Http\Controllers\Api\Public\PublicBookingController;
use App\Modules\Booking\Http\Controllers\Api\Public\PublicBranchController;
use App\Modules\Booking\Http\Controllers\Api\Public\PublicPackageController;
use App\Modules\Booking\Http\Controllers\Api\Public\PublicServiceController;
use App\Modules\Booking\Http\Controllers\Api\Public\PublicAddonController;
use App\Modules\Booking\Http\Controllers\Api\Public\PublicStaffController;
use Illuminate\Support\Facades\Route;

Route::get('/booking/branches', [PublicBranchController::class, 'index']);
Route::get('/booking/addons', [PublicAddonController::class, 'index']);
Route::get('/booking/services', [PublicServiceController::class, 'index']);
Route::get('/booking/packages', [PublicPackageController::class, 'index']);
Route::get('/booking/staff', [PublicStaffController::class, 'index']);
Route::get('/booking/availability', [PublicAvailabilityController::class, 'check']);
Route::get('/booking/bookings/{code}', [PublicBookingController::class, 'show']);

Route::middleware('throttle:5,60')->post('/booking/bookings', [PublicBookingController::class, 'store']);
