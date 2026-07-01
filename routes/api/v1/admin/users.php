<?php

use App\Modules\Admin\Http\Controllers\Api\EmailLogController;
use App\Modules\Admin\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/email-logs', [EmailLogController::class, 'index']);
    Route::delete('/admin/email-logs/old', [EmailLogController::class, 'deleteOld']);
    Route::get('/admin/users', [UserController::class, 'index']);
    Route::post('/admin/users', [UserController::class, 'store']);
    Route::get('/admin/users/{id}', [UserController::class, 'show']);
    Route::put('/admin/users/{id}', [UserController::class, 'update']);
    Route::put('/admin/users/{id}/toggle-active', [UserController::class, 'toggleActive']);
    Route::post('/admin/users/{id}/resend-verification', [UserController::class, 'resendVerification']);
    Route::get('/admin/users/{id}/email-logs', [UserController::class, 'emailLogs']);
    Route::delete('/admin/users/{id}', [UserController::class, 'destroy']);
});
