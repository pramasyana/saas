<?php

use App\Modules\Admin\Http\Controllers\Api\ActivityController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/activity', [ActivityController::class, 'index']);
});
