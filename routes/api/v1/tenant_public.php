<?php

declare(strict_types=1);

use App\Modules\Booking\Http\Controllers\Api\Public\PublicAvailabilityController;
use App\Modules\Booking\Http\Controllers\Api\Public\PublicBookingController;
use App\Modules\Booking\Http\Controllers\Api\Public\PublicBranchController;
use App\Modules\Booking\Http\Controllers\Api\Public\PublicPackageController;
use App\Modules\Booking\Http\Controllers\Api\Public\PublicServiceController;
use App\Modules\Booking\Http\Controllers\Api\Public\PublicAddonController;
use App\Modules\Booking\Http\Controllers\Api\Public\PublicStaffController;
use App\Modules\Booking\Http\Controllers\Api\Public\PublicRoomController;
use Illuminate\Support\Facades\Route;

Route::get('/book/branches', [PublicBranchController::class, 'index']);
Route::get('/book/addons', [PublicAddonController::class, 'index']);
Route::get('/book/services', [PublicServiceController::class, 'index']);
Route::get('/book/packages', [PublicPackageController::class, 'index']);
Route::get('/book/staff', [PublicStaffController::class, 'index']);
Route::get('/book/availability', [PublicAvailabilityController::class, 'check']);
Route::get('/book/rooms', [PublicRoomController::class, 'index']);
Route::get('/book/rooms/available', [PublicRoomController::class, 'available']);
Route::get('/book/bookings/{code}', [PublicBookingController::class, 'show']);

Route::middleware('throttle:5,60')->post('/book/bookings', [PublicBookingController::class, 'store']);


