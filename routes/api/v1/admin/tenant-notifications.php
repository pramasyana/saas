<?php

use App\Modules\Admin\Http\Controllers\Api\TenantNotificationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/tenant-notifications', [TenantNotificationController::class, 'index']);
    Route::post('/admin/tenant-notifications', [TenantNotificationController::class, 'store']);
    Route::get('/admin/tenant-notifications/{id}', [TenantNotificationController::class, 'show']);
    Route::put('/admin/tenant-notifications/{id}', [TenantNotificationController::class, 'update']);
    Route::put('/admin/tenant-notifications/{id}/toggle-active', [TenantNotificationController::class, 'toggleActive']);
    Route::delete('/admin/tenant-notifications/{id}', [TenantNotificationController::class, 'destroy']);
});
