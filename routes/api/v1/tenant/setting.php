<?php

declare(strict_types=1);

use App\Modules\Setting\Http\Controllers\Api\TenantSettingController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('/settings', [TenantSettingController::class, 'index']);
    Route::get('/settings/group/{group}', [TenantSettingController::class, 'group']);
    Route::put('/settings', [TenantSettingController::class, 'update']);
});
