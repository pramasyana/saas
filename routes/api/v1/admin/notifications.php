<?php

use App\Modules\Admin\Http\Controllers\Api\NotificationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/notifications', [NotificationController::class, 'index']);
    Route::post('/admin/notifications', [NotificationController::class, 'store']);
    Route::put('/admin/notifications/{id}', [NotificationController::class, 'update']);
    Route::put('/admin/notifications/{id}/toggle-active', [NotificationController::class, 'toggleActive']);
    Route::delete('/admin/notifications/{id}', [NotificationController::class, 'destroy']);
});

// Public endpoint — no auth, returns active notifications
Route::get('/admin/notifications/active', [NotificationController::class, 'active']);
