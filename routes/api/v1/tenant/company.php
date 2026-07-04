<?php

declare(strict_types=1);

use App\Modules\Company\Http\Controllers\Api\BranchController;
use App\Modules\Company\Http\Controllers\Api\BrandingController;
use App\Modules\Company\Http\Controllers\Api\HolidayController;
use App\Modules\Company\Http\Controllers\Api\ProfileController;
use App\Modules\Company\Http\Controllers\Api\WorkingHourController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('/company/profile', [ProfileController::class, 'show']);
    Route::put('/company/profile', [ProfileController::class, 'update']);

    Route::get('/company/branding', [BrandingController::class, 'show']);
    Route::post('/company/branding', [BrandingController::class, 'update']);

    Route::get('/company/branches', [BranchController::class, 'index']);
    Route::get('/company/branches/{id}', [BranchController::class, 'show']);
    Route::post('/company/branches', [BranchController::class, 'store']);
    Route::put('/company/branches/{id}', [BranchController::class, 'update']);
    Route::delete('/company/branches/{id}', [BranchController::class, 'destroy']);

    Route::get('/company/working-hours', [WorkingHourController::class, 'index']);
    Route::put('/company/working-hours', [WorkingHourController::class, 'update']);

    Route::get('/company/holidays', [HolidayController::class, 'index']);
    Route::post('/company/holidays', [HolidayController::class, 'store']);
    Route::put('/company/holidays/{id}', [HolidayController::class, 'update']);
    Route::delete('/company/holidays/{id}', [HolidayController::class, 'destroy']);
});
