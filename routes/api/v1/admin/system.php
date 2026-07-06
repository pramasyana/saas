<?php

use App\Modules\Admin\Http\Controllers\Api\SystemController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/system', [SystemController::class, 'index']);
    Route::post('/admin/system/maintenance', [SystemController::class, 'toggleMaintenance']);
});
