<?php

declare(strict_types=1);

use App\Modules\Crm\Http\Controllers\Api\CustomerController;
use App\Modules\Crm\Http\Controllers\Api\LoyaltyController;
use App\Modules\Crm\Http\Controllers\Api\LoyaltySettingsController;
use App\Modules\Crm\Http\Controllers\Api\MembershipController;
use App\Modules\Crm\Http\Controllers\Api\MembershipTierController;
use App\Modules\Crm\Http\Controllers\Api\NoteController;
use App\Modules\Crm\Http\Controllers\Api\ReferralController;
use App\Modules\Crm\Http\Controllers\Api\ReviewController;
use App\Modules\Crm\Http\Controllers\Api\RewardController;
use App\Modules\Crm\Http\Controllers\Api\TagController;
use App\Modules\Crm\Http\Controllers\Api\TimelineController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    // Customers
    Route::get('/crm/customers/stats', [CustomerController::class, 'stats']);
    Route::post('/crm/customers/{id}/tags', [CustomerController::class, 'tags']);
    Route::get('/crm/customers', [CustomerController::class, 'index']);
    Route::post('/crm/customers', [CustomerController::class, 'store']);
    Route::get('/crm/customers/{id}', [CustomerController::class, 'show']);
    Route::put('/crm/customers/{id}', [CustomerController::class, 'update']);
    Route::delete('/crm/customers/{id}', [CustomerController::class, 'destroy']);

    // Customer Notes (nested)
    Route::get('/crm/customers/{customerId}/notes', [NoteController::class, 'index']);
    Route::post('/crm/customers/{customerId}/notes', [NoteController::class, 'store']);
    Route::put('/crm/customers/{customerId}/notes/{id}', [NoteController::class, 'update']);
    Route::delete('/crm/customers/{customerId}/notes/{id}', [NoteController::class, 'destroy']);

    // Customer Timeline (nested)
    Route::get('/crm/customers/{customerId}/timeline', [TimelineController::class, 'index']);

    // Customer Membership (nested)
    Route::get('/crm/customers/{customerId}/membership', [MembershipController::class, 'show']);
    Route::put('/crm/customers/{customerId}/membership', [MembershipController::class, 'update']);

    // Customer Loyalty (nested)
    Route::get('/crm/customers/{customerId}/loyalty/balance', [LoyaltyController::class, 'balance']);
    Route::get('/crm/customers/{customerId}/loyalty/transactions', [LoyaltyController::class, 'transactions']);
    Route::post('/crm/customers/{customerId}/loyalty/earn', [LoyaltyController::class, 'earn']);
    Route::post('/crm/customers/{customerId}/loyalty/spend', [LoyaltyController::class, 'spend']);

    // Customer Rewards (nested)
    Route::post('/crm/customers/{customerId}/rewards/redeem', [RewardController::class, 'redeem']);

    // Customer Referrals (nested)
    Route::get('/crm/customers/{customerId}/referrals', [ReferralController::class, 'index']);
    Route::post('/crm/customers/{customerId}/referrals', [ReferralController::class, 'store']);

    // Customer Reviews (nested)
    Route::get('/crm/customers/{customerId}/reviews', [ReviewController::class, 'index']);
    Route::post('/crm/customers/{customerId}/reviews', [ReviewController::class, 'store']);

    // Tags (standalone)
    Route::get('/crm/tags', [TagController::class, 'index']);
    Route::post('/crm/tags', [TagController::class, 'store']);
    Route::put('/crm/tags/{id}', [TagController::class, 'update']);
    Route::delete('/crm/tags/{id}', [TagController::class, 'destroy']);

    // Rewards catalog (standalone)
    Route::get('/crm/rewards', [RewardController::class, 'index']);
    Route::post('/crm/rewards', [RewardController::class, 'store']);
    Route::put('/crm/rewards/{id}', [RewardController::class, 'update']);
    Route::delete('/crm/rewards/{id}', [RewardController::class, 'destroy']);

    // Reviews (standalone — global filter)
    Route::get('/crm/reviews', [ReviewController::class, 'index']);
    Route::put('/crm/reviews/{id}', [ReviewController::class, 'update']);
    Route::post('/crm/reviews/{id}/approve', [ReviewController::class, 'approve']);
    Route::delete('/crm/reviews/{id}', [ReviewController::class, 'destroy']);

    // Referrals (standalone)
    Route::post('/crm/referrals/{id}/convert', [ReferralController::class, 'convert']);
    Route::post('/crm/referrals/{id}/mark-reward', [ReferralController::class, 'markRewardGiven']);

    // Membership Tiers (standalone)
    Route::get('/crm/membership-tiers', [MembershipTierController::class, 'index']);
    Route::post('/crm/membership-tiers', [MembershipTierController::class, 'store']);
    Route::put('/crm/membership-tiers/{id}', [MembershipTierController::class, 'update']);
    Route::delete('/crm/membership-tiers/{id}', [MembershipTierController::class, 'destroy']);

    // Loyalty Config
    Route::get('/crm/loyalty/config', [LoyaltySettingsController::class, 'show']);
    Route::put('/crm/loyalty/config', [LoyaltySettingsController::class, 'update']);
});
