<?php

use App\Modules\Admin\Http\Controllers\Api\AuditLogController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/audit-logs', [AuditLogController::class, 'index']);
});
