<?php

declare(strict_types=1);

use App\Modules\Booking\Http\Controllers\Api\Tenant\CustomerInvoiceController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->prefix('tenant')->group(function () {
    Route::get('/invoices', [CustomerInvoiceController::class, 'index']);
    Route::get('/invoices/stats', [CustomerInvoiceController::class, 'stats']);
    Route::get('/invoices/{id}', [CustomerInvoiceController::class, 'show']);
    Route::get('/invoices/{id}/pdf', [CustomerInvoiceController::class, 'downloadPdf']);
    Route::get('/invoices/{id}/preview', [CustomerInvoiceController::class, 'previewPdf']);
    Route::put('/invoices/{id}/pay', [CustomerInvoiceController::class, 'pay']);
    Route::put('/invoices/{id}/notes', [CustomerInvoiceController::class, 'updateNotes']);
});
