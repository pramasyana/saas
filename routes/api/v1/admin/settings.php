<?php

declare(strict_types=1);

use App\Modules\Admin\Http\Controllers\Api\SettingsController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/settings', [SettingsController::class, 'index']);
    Route::put('/admin/settings', [SettingsController::class, 'update']);
});
