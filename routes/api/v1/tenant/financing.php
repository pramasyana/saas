<?php

declare(strict_types=1);

use App\Modules\Financing\Http\Controllers\Api\CostCategoryController;
use App\Modules\Financing\Http\Controllers\Api\CostController;
use Illuminate\Support\Facades\Route;

Route::get('/financing/stats', [CostController::class, 'stats']);
Route::get('/financing/overview', [CostController::class, 'overview']);
Route::get('/financing/monthly', [CostController::class, 'monthly']);
Route::get('/financing/breakdown', [CostController::class, 'breakdown']);
Route::post('/financing/import', [CostController::class, 'import']);

Route::apiResource('/financing/costs', CostController::class)->except(['show'])->names('financing.costs');

Route::apiResource('/financing/categories', CostCategoryController::class)->except(['show', 'index'])->names('financing.categories');
Route::get('/financing/categories', [CostCategoryController::class, 'index']);
