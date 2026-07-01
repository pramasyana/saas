<?php

use App\Modules\Pricing\Http\Controllers\Api\PublicPlanController;
use Illuminate\Support\Facades\Route;

Route::get('/plans', [PublicPlanController::class, 'index']);
