<?php

declare(strict_types=1);

namespace App\Modules\Staff\Providers;

use App\Modules\Staff\Contracts\AttendanceRepositoryInterface;
use App\Modules\Staff\Contracts\CommissionRepositoryInterface;
use App\Modules\Staff\Contracts\LeaveRepositoryInterface;
use App\Modules\Staff\Contracts\ScheduleRepositoryInterface;
use App\Modules\Staff\Contracts\StaffRepositoryInterface;
use App\Modules\Staff\Repositories\AttendanceRepository;
use App\Modules\Staff\Repositories\CommissionRepository;
use App\Modules\Staff\Repositories\LeaveRepository;
use App\Modules\Staff\Repositories\ScheduleRepository;
use App\Modules\Staff\Repositories\StaffRepository;
use Illuminate\Support\ServiceProvider;

class StaffServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(StaffRepositoryInterface::class, StaffRepository::class);
        $this->app->bind(ScheduleRepositoryInterface::class, ScheduleRepository::class);
        $this->app->bind(AttendanceRepositoryInterface::class, AttendanceRepository::class);
        $this->app->bind(LeaveRepositoryInterface::class, LeaveRepository::class);
        $this->app->bind(CommissionRepositoryInterface::class, CommissionRepository::class);
    }
}
