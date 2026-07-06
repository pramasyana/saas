<?php

declare(strict_types=1);

use App\Modules\Admin\Http\Controllers\Api\TenantNotificationController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('/tenant-notifications', [TenantNotificationController::class, 'forTenant']);
    Route::put('/tenant-notifications/{id}/read', [TenantNotificationController::class, 'markAsRead']);
});
