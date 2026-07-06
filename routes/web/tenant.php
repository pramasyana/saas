<?php

declare(strict_types=1);

use App\Modules\Auth\Http\Controllers\DashboardController;
use App\Modules\Auth\Http\Controllers\ProfilePageController;
use App\Modules\Booking\Http\Controllers\Tenant\AnalyticsController as TenantAnalyticsController;
use App\Modules\Booking\Http\Controllers\Tenant\BookingController as TenantBookingController;
use App\Modules\Booking\Http\Controllers\Tenant\RoomController as TenantRoomController;
use App\Modules\Company\Http\Controllers\Tenant\BranchController;
use App\Modules\Setting\Http\Controllers\SettingController as TenantSettingController;
use App\Modules\Company\Http\Controllers\Tenant\HolidayController;
use App\Modules\Company\Http\Controllers\Tenant\ProfileController;
use App\Modules\Company\Http\Controllers\Tenant\WorkingHourController;
use App\Modules\Crm\Http\Controllers\Tenant\CustomerController as CrmCustomerController;
use App\Modules\Crm\Http\Controllers\Tenant\CustomerMembershipController as CrmCustomerMembershipController;
use App\Modules\Crm\Http\Controllers\Tenant\LoyaltySettingsController as CrmLoyaltySettingsController;
use App\Modules\Crm\Http\Controllers\Tenant\MembershipTierController as CrmMembershipTierController;
use App\Modules\Crm\Http\Controllers\Tenant\TagController as CrmTagController;
use App\Modules\Service\Http\Controllers\Tenant\AddonController as ServiceAddonController;
use App\Modules\Service\Http\Controllers\Tenant\CategoryController as ServiceCategoryController;
use App\Modules\Service\Http\Controllers\Tenant\PackageController as ServicePackageController;
use App\Modules\Service\Http\Controllers\Tenant\PricingRuleController as ServicePricingRuleController;
use App\Modules\Service\Http\Controllers\Tenant\PromotionController as ServicePromotionController;
use App\Modules\Service\Http\Controllers\Tenant\ServiceController as TenantServiceController;
use App\Modules\Staff\Http\Controllers\Tenant\AttendanceController;
use App\Modules\Staff\Http\Controllers\Tenant\CommissionController;
use App\Modules\Staff\Http\Controllers\Tenant\LeaveController;
use App\Modules\Staff\Http\Controllers\Tenant\ScheduleController;
use App\Modules\Staff\Http\Controllers\Tenant\StaffController;
use App\Modules\Staff\Http\Controllers\Tenant\StaffUserController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('tenant.dashboard');
    Route::get('/account/profile', [ProfilePageController::class, 'index'])->name('tenant.account.profile');

    Route::prefix('company')->name('tenant.company.')->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');

        Route::get('/branches', [BranchController::class, 'index'])->name('branches.index');
        Route::get('/branches/create', [BranchController::class, 'create'])->name('branches.create');
        Route::get('/branches/{id}/edit', [BranchController::class, 'edit'])->name('branches.edit');
        Route::post('/branches', [BranchController::class, 'store'])->name('branches.store');
        Route::put('/branches/{id}', [BranchController::class, 'update'])->name('branches.update');
        Route::delete('/branches/{id}', [BranchController::class, 'destroy'])->name('branches.destroy');
        Route::get('/working-hours', [WorkingHourController::class, 'edit'])->name('working-hours.edit');
        Route::put('/working-hours', [WorkingHourController::class, 'update'])->name('working-hours.update');
        Route::get('/holidays', [HolidayController::class, 'index'])->name('holidays.index');
        Route::post('/holidays', [HolidayController::class, 'store'])->name('holidays.store');
        Route::put('/holidays/{id}', [HolidayController::class, 'update'])->name('holidays.update');
        Route::delete('/holidays/{id}', [HolidayController::class, 'destroy'])->name('holidays.destroy');

        Route::get('/rooms', [TenantRoomController::class, 'index'])->name('rooms.index');
        Route::get('/rooms/create', [TenantRoomController::class, 'create'])->name('rooms.create');
        Route::get('/rooms/{id}/edit', [TenantRoomController::class, 'edit'])->name('rooms.edit');

        Route::get('/settings', [TenantSettingController::class, 'index'])->name('settings');
    });

    // Staff pages (Inertia shell)
    Route::prefix('crm')->name('tenant.crm.')->group(function () {
        Route::get('/customers', [CrmCustomerController::class, 'index'])->name('customers');
        Route::get('/customers/create', [CrmCustomerController::class, 'create'])->name('customers.create');
        Route::get('/customers/{id}', [CrmCustomerController::class, 'show'])->name('customers.show');
        Route::get('/customers/{id}/edit', [CrmCustomerController::class, 'edit'])->name('customers.edit');
        Route::get('/tags', [CrmTagController::class, 'index'])->name('tags');
        Route::get('/membership-tiers', [CrmMembershipTierController::class, 'index'])->name('membership-tiers');
        Route::get('/membership-plans', [CrmCustomerMembershipController::class, 'plans'])->name('membership-plans');
        Route::get('/membership-plans/create', [CrmCustomerMembershipController::class, 'createPlan'])->name('membership-plans.create');
        Route::get('/membership-plans/{id}/edit', [CrmCustomerMembershipController::class, 'editPlan'])->name('membership-plans.edit');
        Route::get('/subscriptions', [CrmCustomerMembershipController::class, 'subscriptions'])->name('subscriptions');
        Route::get('/loyalty', [CrmLoyaltySettingsController::class, 'index'])->name('loyalty');
    });

    // Booking pages
    Route::prefix('booking')->name('tenant.booking.')->group(function () {
        Route::get('/analytics', [TenantAnalyticsController::class, 'index'])->name('analytics');
        Route::get('/', [TenantBookingController::class, 'index'])->name('index');
        Route::get('/walk-in', [TenantBookingController::class, 'walkIn'])->name('walk-in');
        Route::get('/waiting-list', [TenantBookingController::class, 'waitingList'])->name('waiting-list');
        Route::get('/online', [TenantBookingController::class, 'online'])->name('online');
        Route::get('/reminders', [TenantBookingController::class, 'reminders'])->name('reminders');
        Route::get('/landing', [TenantBookingController::class, 'landing'])->name('landing');
    });

    // Service pages
    Route::prefix('service')->name('tenant.service.')->group(function () {
        Route::get('/categories', [ServiceCategoryController::class, 'index'])->name('categories');
        Route::get('/categories/create', [ServiceCategoryController::class, 'create'])->name('categories.create');
        Route::get('/categories/{id}/edit', [ServiceCategoryController::class, 'edit'])->name('categories.edit');
        Route::get('/services', [TenantServiceController::class, 'index'])->name('services');
        Route::get('/services/create', [TenantServiceController::class, 'create'])->name('services.create');
        Route::get('/services/{id}/edit', [TenantServiceController::class, 'edit'])->name('services.edit');
        Route::get('/packages', [ServicePackageController::class, 'index'])->name('packages');
        Route::get('/packages/create', [ServicePackageController::class, 'create'])->name('packages.create');
        Route::get('/packages/{id}/edit', [ServicePackageController::class, 'edit'])->name('packages.edit');
        Route::get('/addons', [ServiceAddonController::class, 'index'])->name('addons');
        Route::get('/addons/create', [ServiceAddonController::class, 'create'])->name('addons.create');
        Route::get('/addons/{id}/edit', [ServiceAddonController::class, 'edit'])->name('addons.edit');
        Route::get('/pricing-rules', [ServicePricingRuleController::class, 'index'])->name('pricing-rules');
        Route::get('/pricing-rules/create', [ServicePricingRuleController::class, 'create'])->name('pricing-rules.create');
        Route::get('/pricing-rules/{id}/edit', [ServicePricingRuleController::class, 'edit'])->name('pricing-rules.edit');
        Route::get('/promotions', [ServicePromotionController::class, 'index'])->name('promotions');
        Route::get('/promotions/create', [ServicePromotionController::class, 'create'])->name('promotions.create');
        Route::get('/promotions/{id}/edit', [ServicePromotionController::class, 'edit'])->name('promotions.edit');
    });

    Route::prefix('staff')->name('tenant.staff.')->group(function () {
        Route::get('/users', [StaffUserController::class, 'index'])->name('users');
        Route::get('/users/create', [StaffUserController::class, 'create'])->name('users.create');
        Route::get('/users/{id}/edit', [StaffUserController::class, 'edit'])->name('users.edit');
        Route::get('/', [StaffController::class, 'index'])->name('index');
        Route::get('/create', [StaffController::class, 'create'])->name('create');
        Route::get('/{id}/edit', [StaffController::class, 'edit'])->name('edit');
        Route::get('/schedule', [ScheduleController::class, 'index'])->name('schedule');
        Route::get('/attendance', [AttendanceController::class, 'index'])->name('attendance');
        Route::get('/attendance/create', [AttendanceController::class, 'create'])->name('attendance.create');
        Route::get('/attendance/{id}/edit', [AttendanceController::class, 'edit'])->name('attendance.edit');
        Route::get('/leave', [LeaveController::class, 'index'])->name('leave');
        Route::get('/leave/create', [LeaveController::class, 'create'])->name('leave.create');
        Route::get('/commission', [CommissionController::class, 'index'])->name('commission');
        Route::get('/commission/create', [CommissionController::class, 'create'])->name('commission.create');
        Route::get('/commission/{id}/edit', [CommissionController::class, 'edit'])->name('commission.edit');
    });
});
