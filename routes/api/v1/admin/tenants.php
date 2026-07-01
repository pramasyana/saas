<?php

declare(strict_types=1);

use App\Modules\Tenant\Http\Controllers\Api\TenantController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/tenants', [TenantController::class, 'index']);
    Route::post('/admin/tenants', [TenantController::class, 'store']);
    Route::get('/admin/tenants/{id}', [TenantController::class, 'show']);
    Route::put('/admin/tenants/{id}', [TenantController::class, 'update']);
    Route::delete('/admin/tenants/{id}', [TenantController::class, 'destroy']);
});
