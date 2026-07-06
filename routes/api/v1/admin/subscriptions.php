<?php

use App\Modules\Subscription\Http\Controllers\Api\InvoiceController;
use App\Modules\Subscription\Http\Controllers\Api\SubscriptionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/subscriptions', [SubscriptionController::class, 'index']);
    Route::post('/admin/subscriptions', [SubscriptionController::class, 'store']);
    Route::get('/admin/subscriptions/{id}', [SubscriptionController::class, 'show']);
    Route::put('/admin/subscriptions/{id}/cancel', [SubscriptionController::class, 'cancel']);
    Route::put('/admin/subscriptions/{id}/change-plan', [SubscriptionController::class, 'changePlan']);

    Route::get('/admin/invoices', [InvoiceController::class, 'index']);
    Route::get('/admin/invoices/{id}', [InvoiceController::class, 'show']);
});
