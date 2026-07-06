<?php

declare(strict_types=1);

use App\Modules\Auth\Http\Controllers\AuthController;
use App\Modules\Auth\Http\Controllers\RegisterController;
use App\Modules\Auth\Http\Controllers\TenantForgotPasswordController;
use App\Modules\Auth\Http\Controllers\TenantResetPasswordController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisterController::class, 'create'])->name('tenant.register');
    Route::post('/register', [RegisterController::class, 'store']);
    Route::get('/login', [AuthController::class, 'createLogin'])->name('tenant.login');
    Route::post('/login', [AuthController::class, 'storeLogin']);
    Route::get('/forgot-password', [TenantForgotPasswordController::class, 'create'])->name('tenant.forgot-password');
    Route::post('/forgot-password', [TenantForgotPasswordController::class, 'store']);
    Route::get('/reset-password/{token}', [TenantResetPasswordController::class, 'create'])->name('tenant.reset-password');
    Route::post('/reset-password', [TenantResetPasswordController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'destroy'])->name('tenant.logout');
});

Route::get('/email/verification-notice', [AuthController::class, 'verificationNotice'])
    ->name('verification.notice');
