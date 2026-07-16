<?php

declare(strict_types=1);

use App\Modules\Staff\Http\Controllers\Api\AttendanceController;
use App\Modules\Staff\Http\Controllers\Api\CommissionController;
use App\Modules\Staff\Http\Controllers\Api\LeaveController;
use App\Modules\Staff\Http\Controllers\Api\ScheduleController;
use App\Modules\Staff\Http\Controllers\Api\ShiftAssignmentController;
use App\Modules\Staff\Http\Controllers\Api\StaffController;
use App\Modules\Staff\Http\Controllers\Api\StaffServiceController;
use App\Modules\Staff\Http\Controllers\Api\StaffUserController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    // Tenant Users
    Route::get('/staff/users', [StaffUserController::class, 'index']);
    Route::post('/staff/users', [StaffUserController::class, 'store']);
    Route::get('/staff/users/{id}', [StaffUserController::class, 'show']);
    Route::put('/staff/users/{id}', [StaffUserController::class, 'update']);
    Route::delete('/staff/users/{id}', [StaffUserController::class, 'destroy']);

    // Schedule
    Route::get('/staff/schedules', [ScheduleController::class, 'index']);
    Route::put('/staff/schedules', [ScheduleController::class, 'update']);

    // Attendance
    Route::get('/staff/attendance', [AttendanceController::class, 'index']);
    Route::post('/staff/attendance', [AttendanceController::class, 'store']);
    Route::put('/staff/attendance/{id}', [AttendanceController::class, 'update']);
    Route::delete('/staff/attendance/{id}', [AttendanceController::class, 'destroy']);

    // Leave
    Route::get('/staff/leaves', [LeaveController::class, 'index']);
    Route::post('/staff/leaves', [LeaveController::class, 'store']);
    Route::put('/staff/leaves/{id}', [LeaveController::class, 'update']);
    Route::delete('/staff/leaves/{id}', [LeaveController::class, 'destroy']);

    // Commission
    Route::get('/staff/commissions', [CommissionController::class, 'index']);
    Route::post('/staff/commissions', [CommissionController::class, 'store']);
    Route::put('/staff/commissions/{id}', [CommissionController::class, 'update']);
    Route::delete('/staff/commissions/{id}', [CommissionController::class, 'destroy']);

    // Staff-Service Mapping
    Route::get('/staff/{staff}/services', [StaffServiceController::class, 'index']);
    Route::put('/staff/{staff}/services', [StaffServiceController::class, 'sync']);

    // Shift Assignments
    Route::get('/staff/shifts', [ShiftAssignmentController::class, 'index']);
    Route::post('/staff/shifts', [ShiftAssignmentController::class, 'bulkStore']);
    Route::delete('/staff/shifts', [ShiftAssignmentController::class, 'destroy']);

    // Staff CRUD (MUST be last to avoid shadowing literal sub-routes like /staff/leaves)
    Route::get('/staff', [StaffController::class, 'index']);
    Route::get('/staff/all', [StaffController::class, 'all']);
    Route::post('/staff', [StaffController::class, 'store']);
    Route::get('/staff/{id}', [StaffController::class, 'show']);
    Route::put('/staff/{id}', [StaffController::class, 'update']);
    Route::delete('/staff/{id}', [StaffController::class, 'destroy']);
});
