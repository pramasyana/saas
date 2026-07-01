<?php

use App\Modules\Admin\Http\Controllers\AuthController;
use App\Modules\Admin\Http\Controllers\DashboardController;
use App\Modules\Admin\Http\Controllers\EmailLogController;
use App\Modules\Admin\Http\Controllers\SettingsController;
use App\Modules\Admin\Http\Controllers\UserController;
use App\Modules\Admin\Http\Controllers\VerificationController;
use App\Modules\Pricing\Http\Controllers\PlanController;
use App\Modules\Subscription\Http\Controllers\SubscriptionController as SubscriptionPageController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('/admin/login', [AuthController::class, 'create'])->name('admin.login');
    Route::post('/admin/login', [AuthController::class, 'store']);
});

Route::get('/email/verify/{id}/{hash}', [VerificationController::class, 'verify'])
    ->middleware('signed')
    ->name('verification.verify');

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');
    Route::get('/admin/users', [UserController::class, 'index'])->name('admin.users');
    Route::get('/admin/users/create', [UserController::class, 'create'])->name('admin.users.create');
    Route::get('/admin/users/{user}/edit', [UserController::class, 'edit'])->name('admin.users.edit');
    Route::get('/admin/settings', [SettingsController::class, 'index'])->name('admin.settings');
    Route::get('/admin/email-logs', [EmailLogController::class, 'index'])->name('admin.email-logs');
    Route::get('/admin/pricing', [PlanController::class, 'index'])->name('admin.pricing');
    Route::get('/admin/pricing/create', [PlanController::class, 'create'])->name('admin.pricing.create');
    Route::get('/admin/pricing/{id}/edit', [PlanController::class, 'edit'])->name('admin.pricing.edit');
    Route::get('/admin/subscriptions', [SubscriptionPageController::class, 'index'])->name('admin.subscriptions');
    Route::post('/admin/logout', [AuthController::class, 'destroy'])->name('admin.logout');
});
