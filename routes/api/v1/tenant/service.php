<?php

declare(strict_types=1);

use App\Modules\Service\Http\Controllers\Api\AddonController;
use App\Modules\Service\Http\Controllers\Api\CategoryController;
use App\Modules\Service\Http\Controllers\Api\PackageController;
use App\Modules\Service\Http\Controllers\Api\PricingRuleController;
use App\Modules\Service\Http\Controllers\Api\PromotionController;
use App\Modules\Service\Http\Controllers\Api\ServiceController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('/service/categories/all', [CategoryController::class, 'all']);
    Route::apiResource('/service/categories', CategoryController::class);

    Route::get('/service/services/all', [ServiceController::class, 'all']);
    Route::apiResource('/service/services', ServiceController::class);

    Route::get('/service/packages/all', [PackageController::class, 'all']);
    Route::apiResource('/service/packages', PackageController::class);

    Route::get('/service/addons/all', [AddonController::class, 'all']);
    Route::apiResource('/service/addons', AddonController::class);

    Route::post('/service/pricing-rules/calculate', [PricingRuleController::class, 'calculate']);
    Route::apiResource('/service/pricing-rules', PricingRuleController::class);

    Route::apiResource('/service/promotions', PromotionController::class);
});
