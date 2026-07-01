<?php

use App\Modules\Auth\Http\Controllers\AuthController;
use App\Modules\Auth\Http\Controllers\RegisterController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisterController::class, 'create'])->name('register');
    Route::post('/register', [RegisterController::class, 'store']);
    Route::get('/login', [AuthController::class, 'createLogin'])->name('tenant.login');
    Route::post('/login', [AuthController::class, 'storeLogin']);
});

Route::get('/email/verification-notice', [AuthController::class, 'verificationNotice'])
    ->name('verification.notice');
