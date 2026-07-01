<?php

declare(strict_types=1);

use App\Modules\Auth\Http\Controllers\AuthController;
use App\Modules\Auth\Http\Controllers\DashboardController;
use App\Modules\Auth\Http\Controllers\RegisterController;
use App\Modules\Company\Http\Controllers\Tenant\BranchController;
use App\Modules\Company\Http\Controllers\Tenant\BrandingController;
use App\Modules\Company\Http\Controllers\Tenant\HolidayController;
use App\Modules\Company\Http\Controllers\Tenant\ProfileController;
use App\Modules\Company\Http\Controllers\Tenant\WorkingHourController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisterController::class, 'create'])->name('tenant.register');
    Route::post('/register', [RegisterController::class, 'store']);
    Route::get('/login', [AuthController::class, 'createLogin'])->name('tenant.login');
    Route::post('/login', [AuthController::class, 'storeLogin']);
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('tenant.dashboard');
    Route::post('/logout', [AuthController::class, 'destroy'])->name('tenant.logout');
    Route::get('/email/verification-notice', [AuthController::class, 'verificationNotice'])
        ->name('verification.notice');

    Route::prefix('company')->name('tenant.company.')->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::get('/branding', [BrandingController::class, 'edit'])->name('branding.edit');
        Route::put('/branding', [BrandingController::class, 'update'])->name('branding.update');
        Route::get('/branches', [BranchController::class, 'index'])->name('branches.index');
        Route::post('/branches', [BranchController::class, 'store'])->name('branches.store');
        Route::put('/branches/{id}', [BranchController::class, 'update'])->name('branches.update');
        Route::delete('/branches/{id}', [BranchController::class, 'destroy'])->name('branches.destroy');
        Route::get('/working-hours', [WorkingHourController::class, 'edit'])->name('working-hours.edit');
        Route::put('/working-hours', [WorkingHourController::class, 'update'])->name('working-hours.update');
        Route::get('/holidays', [HolidayController::class, 'index'])->name('holidays.index');
        Route::post('/holidays', [HolidayController::class, 'store'])->name('holidays.store');
        Route::put('/holidays/{id}', [HolidayController::class, 'update'])->name('holidays.update');
        Route::delete('/holidays/{id}', [HolidayController::class, 'destroy'])->name('holidays.destroy');
    });
});
