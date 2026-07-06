<?php

use App\Modules\Admin\Http\Controllers\ActivityPageController;
use App\Modules\Admin\Http\Controllers\AuditLogPageController;
use App\Modules\Admin\Http\Controllers\AuthController;
use App\Modules\Admin\Http\Controllers\ExportController;
use App\Modules\Admin\Http\Controllers\ForgotPasswordController;
use App\Modules\Admin\Http\Controllers\ResetPasswordController;
use App\Modules\Admin\Http\Controllers\SystemPageController;
use App\Modules\Admin\Http\Controllers\DashboardController;
use App\Modules\Admin\Http\Controllers\EmailLogController;
use App\Modules\Admin\Http\Controllers\ImpersonationController;
use App\Modules\Admin\Http\Controllers\InvoicePageController;
use App\Modules\Admin\Http\Controllers\NotificationPageController;
use App\Modules\Admin\Http\Controllers\ProfilePageController;
use App\Modules\Admin\Http\Controllers\TenantNotificationPageController;
use App\Modules\Admin\Http\Controllers\RevenueController;
use App\Modules\Admin\Http\Controllers\SettingsController;
use App\Modules\Admin\Http\Controllers\UserController;
use App\Modules\Admin\Http\Controllers\VerificationController;
use App\Modules\Company\Http\Controllers\Admin\BranchController;
use App\Modules\Company\Http\Controllers\Admin\BrandingController;
use App\Modules\Company\Http\Controllers\Admin\HolidayController;
use App\Modules\Company\Http\Controllers\Admin\ProfileController;
use App\Modules\Company\Http\Controllers\Admin\WorkingHourController;
use App\Modules\Pricing\Http\Controllers\PlanController;
use App\Modules\Subscription\Http\Controllers\SubscriptionController as SubscriptionPageController;
use App\Modules\Subscription\Http\Controllers\TenantSubscriptionController;
use App\Modules\Tenant\Http\Controllers\TenantController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('/admin/login', [AuthController::class, 'create'])->name('admin.login');
    Route::post('/admin/login', [AuthController::class, 'store']);

    Route::get('/admin/forgot-password', [ForgotPasswordController::class, 'create'])->name('admin.forgot-password');
    Route::post('/admin/forgot-password', [ForgotPasswordController::class, 'store']);

    Route::get('/admin/reset-password/{token}', [ResetPasswordController::class, 'create'])->name('admin.reset-password');
    Route::post('/admin/reset-password', [ResetPasswordController::class, 'store']);
});

Route::get('/email/verify/{id}/{hash}', [VerificationController::class, 'verify'])
    ->middleware('signed')
    ->name('verification.verify');

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');
    Route::get('/admin/users', [UserController::class, 'index'])->name('admin.users');
    Route::get('/admin/users/create', [UserController::class, 'create'])->name('admin.users.create');
    Route::get('/admin/users/{user}/edit', [UserController::class, 'edit'])->name('admin.users.edit');
    Route::get('/admin/settings', [SettingsController::class, 'index'])->name('admin.settings');
    Route::get('/admin/email-logs', [EmailLogController::class, 'index'])->name('admin.email-logs');
    Route::get('/admin/pricing', [PlanController::class, 'index'])->name('admin.pricing');
    Route::get('/admin/pricing/create', [PlanController::class, 'create'])->name('admin.pricing.create');
    Route::get('/admin/pricing/{id}/edit', [PlanController::class, 'edit'])->name('admin.pricing.edit');
    Route::get('/admin/revenue', [RevenueController::class, 'index'])->name('admin.revenue');
    Route::get('/admin/profile', [ProfilePageController::class, 'index'])->name('admin.profile');
    Route::get('/admin/activity', [ActivityPageController::class, 'index'])->name('admin.activity');
    Route::get('/admin/system', [SystemPageController::class, 'index'])->name('admin.system');
    Route::get('/admin/audit-logs', [AuditLogPageController::class, 'index'])->name('admin.audit-logs');
    Route::get('/admin/notifications', [NotificationPageController::class, 'index'])->name('admin.notifications');
    Route::get('/admin/tenant-notifications', [TenantNotificationPageController::class, 'index'])->name('admin.tenant-notifications');
    Route::get('/admin/subscriptions', [SubscriptionPageController::class, 'index'])->name('admin.subscriptions');
    Route::get('/admin/invoices', [InvoicePageController::class, 'index'])->name('admin.invoices');
    Route::get('/admin/tenants/{tenantId}/subscription', [TenantSubscriptionController::class, 'show'])->name('admin.tenants.subscription');
    Route::get('/admin/tenants', [TenantController::class, 'index'])->name('admin.tenants');
    Route::get('/admin/tenants/create', [TenantController::class, 'create'])->name('admin.tenants.create');
    Route::get('/admin/tenants/{id}', [TenantController::class, 'show'])->name('admin.tenants.show');
    Route::get('/admin/tenants/{id}/edit', [TenantController::class, 'edit'])->name('admin.tenants.edit');
    Route::get('/admin/tenants/{tenantId}/company/profile', [ProfileController::class, 'edit'])->name('admin.tenants.company.profile.edit');
    Route::put('/admin/tenants/{tenantId}/company/profile', [ProfileController::class, 'update'])->name('admin.tenants.company.profile.update');
    Route::get('/admin/tenants/{tenantId}/company/branding', [BrandingController::class, 'edit'])->name('admin.tenants.company.branding.edit');
    Route::put('/admin/tenants/{tenantId}/company/branding', [BrandingController::class, 'update'])->name('admin.tenants.company.branding.update');
    Route::get('/admin/tenants/{tenantId}/company/branches', [BranchController::class, 'index'])->name('admin.tenants.company.branches.index');
    Route::post('/admin/tenants/{tenantId}/company/branches', [BranchController::class, 'store'])->name('admin.tenants.company.branches.store');
    Route::put('/admin/tenants/{tenantId}/company/branches/{id}', [BranchController::class, 'update'])->name('admin.tenants.company.branches.update');
    Route::delete('/admin/tenants/{tenantId}/company/branches/{id}', [BranchController::class, 'destroy'])->name('admin.tenants.company.branches.destroy');
    Route::get('/admin/tenants/{tenantId}/company/working-hours', [WorkingHourController::class, 'edit'])->name('admin.tenants.company.working-hours.edit');
    Route::put('/admin/tenants/{tenantId}/company/working-hours', [WorkingHourController::class, 'update'])->name('admin.tenants.company.working-hours.update');
    Route::get('/admin/tenants/{tenantId}/company/holidays', [HolidayController::class, 'index'])->name('admin.tenants.company.holidays.index');
    Route::post('/admin/tenants/{tenantId}/company/holidays', [HolidayController::class, 'store'])->name('admin.tenants.company.holidays.store');
    Route::put('/admin/tenants/{tenantId}/company/holidays/{id}', [HolidayController::class, 'update'])->name('admin.tenants.company.holidays.update');
    Route::delete('/admin/tenants/{tenantId}/company/holidays/{id}', [HolidayController::class, 'destroy'])->name('admin.tenants.company.holidays.destroy');
    Route::post('/admin/tenants/{tenantId}/impersonate', [ImpersonationController::class, 'store'])->name('admin.tenants.impersonate');
    Route::get('/admin/export/tenants', [ExportController::class, 'tenants'])->name('admin.export.tenants');
    Route::get('/admin/export/subscriptions', [ExportController::class, 'subscriptions'])->name('admin.export.subscriptions');
    Route::get('/admin/export/invoices', [ExportController::class, 'invoices'])->name('admin.export.invoices');
    Route::post('/admin/logout', [AuthController::class, 'destroy'])->name('admin.logout');
});

Route::middleware('auth')->post('/admin/impersonate/leave', [ImpersonationController::class, 'leave'])->name('admin.impersonate.leave');
