<?php

declare(strict_types=1);

use App\Modules\Auth\Http\Controllers\AuthController;
use App\Modules\Auth\Http\Controllers\DashboardController;
use App\Modules\Auth\Http\Controllers\RegisterController;
use App\Modules\Company\Http\Controllers\Tenant\BranchController;
use App\Modules\Company\Http\Controllers\Tenant\BrandingController;
use App\Modules\Company\Http\Controllers\Tenant\HolidayController;
use App\Modules\Company\Http\Controllers\Tenant\ProfileController;
use App\Modules\Company\Http\Controllers\Tenant\WorkingHourController;
use App\Modules\Staff\Http\Controllers\Tenant\AttendanceController;
use App\Modules\Staff\Http\Controllers\Tenant\CommissionController;
use App\Modules\Staff\Http\Controllers\Tenant\LeaveController;
use App\Modules\Staff\Http\Controllers\Tenant\ScheduleController;
use App\Modules\Staff\Http\Controllers\Tenant\StaffController;
use App\Modules\Staff\Http\Controllers\Tenant\StaffUserController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisterController::class, 'create'])->name('tenant.register');
    Route::post('/register', [RegisterController::class, 'store']);
    Route::get('/login', [AuthController::class, 'createLogin'])->name('tenant.login');
    Route::post('/login', [AuthController::class, 'storeLogin']);
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('tenant.dashboard');
    Route::post('/logout', [AuthController::class, 'destroy'])->name('tenant.logout');
    Route::get('/email/verification-notice', [AuthController::class, 'verificationNotice'])
        ->name('verification.notice');

    Route::prefix('company')->name('tenant.company.')->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::get('/branding', [BrandingController::class, 'edit'])->name('branding.edit');
        Route::put('/branding', [BrandingController::class, 'update'])->name('branding.update');
        Route::get('/branches', [BranchController::class, 'index'])->name('branches.index');
        Route::post('/branches', [BranchController::class, 'store'])->name('branches.store');
        Route::put('/branches/{id}', [BranchController::class, 'update'])->name('branches.update');
        Route::delete('/branches/{id}', [BranchController::class, 'destroy'])->name('branches.destroy');
        Route::get('/working-hours', [WorkingHourController::class, 'edit'])->name('working-hours.edit');
        Route::put('/working-hours', [WorkingHourController::class, 'update'])->name('working-hours.update');
        Route::get('/holidays', [HolidayController::class, 'index'])->name('holidays.index');
        Route::post('/holidays', [HolidayController::class, 'store'])->name('holidays.store');
        Route::put('/holidays/{id}', [HolidayController::class, 'update'])->name('holidays.update');
        Route::delete('/holidays/{id}', [HolidayController::class, 'destroy'])->name('holidays.destroy');
    });

    // Staff pages (Inertia shell)
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
