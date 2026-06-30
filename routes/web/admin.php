<?php

use App\Modules\Admin\Http\Controllers\AuthController;
use App\Modules\Admin\Http\Controllers\DashboardController;
use App\Modules\Admin\Http\Controllers\SettingsController;
use App\Modules\Admin\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('/admin/login', [AuthController::class, 'create'])->name('admin.login');
    Route::post('/admin/login', [AuthController::class, 'store']);
});

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');
    Route::get('/admin/users', [UserController::class, 'index'])->name('admin.users');
    Route::get('/admin/settings', [SettingsController::class, 'index'])->name('admin.settings');
    Route::post('/admin/logout', [AuthController::class, 'destroy'])->name('admin.logout');
});
