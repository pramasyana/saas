<?php

use App\Modules\Pricing\Http\Controllers\Api\FeatureDefinitionController;
use App\Modules\Pricing\Http\Controllers\Api\PlanController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/plans', [PlanController::class, 'index']);
    Route::post('/admin/plans', [PlanController::class, 'store']);
    Route::get('/admin/plans/{id}', [PlanController::class, 'show']);
    Route::put('/admin/plans/{id}', [PlanController::class, 'update']);
    Route::put('/admin/plans/{id}/toggle-popular', [PlanController::class, 'togglePopular']);
    Route::delete('/admin/plans/{id}', [PlanController::class, 'destroy']);

    Route::get('/admin/feature-definitions', [FeatureDefinitionController::class, 'index']);
    Route::post('/admin/feature-definitions', [FeatureDefinitionController::class, 'store']);
    Route::put('/admin/feature-definitions/{id}', [FeatureDefinitionController::class, 'update']);
    Route::delete('/admin/feature-definitions/{id}', [FeatureDefinitionController::class, 'destroy']);
});
