<?php

declare(strict_types=1);

use App\Modules\Auth\Http\Controllers\AuthController;
use App\Modules\Auth\Http\Controllers\DashboardController;
use App\Modules\Auth\Http\Controllers\RegisterController;
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
});
