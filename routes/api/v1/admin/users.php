<?php

use App\Modules\Admin\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/users', [UserController::class, 'index']);
    Route::post('/admin/users', [UserController::class, 'store']);
    Route::get('/admin/users/{id}', [UserController::class, 'show']);
    Route::put('/admin/users/{id}', [UserController::class, 'update']);
    Route::put('/admin/users/{id}/toggle-active', [UserController::class, 'toggleActive']);
    Route::delete('/admin/users/{id}', [UserController::class, 'destroy']);
});
