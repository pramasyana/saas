<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Modules\Company\Models\Holiday;
use App\Modules\Company\Models\WorkingHour;
use App\Modules\Staff\Models\Leave;
use App\Modules\Staff\Models\Staff;
use App\Modules\Staff\Models\StaffSchedule;
use Illuminate\Database\Seeder;

class AvailabilitySeeder extends Seeder
{
    public function run(string $tenantId, string $branchId): void
    {
        $this->seedWorkingHours($tenantId, $branchId);
        $staffIds = $this->seedStaff($tenantId, $branchId);
        $this->seedStaffSchedules($tenantId, ...$staffIds);
        $this->seedHolidays($tenantId, $branchId);
    }

    private function seedWorkingHours(string $tenantId, string $branchId): void
    {
        $days = [
            ['day' => 0, 'is_open' => false, 'open' => null, 'close' => null],        // Minggu
            ['day' => 1, 'is_open' => true, 'open' => '08:00', 'close' => '17:00'],    // Senin
            ['day' => 2, 'is_open' => true, 'open' => '08:00', 'close' => '17:00'],    // Selasa
            ['day' => 3, 'is_open' => true, 'open' => '08:00', 'close' => '17:00'],    // Rabu
            ['day' => 4, 'is_open' => true, 'open' => '08:00', 'close' => '17:00'],    // Kamis
            ['day' => 5, 'is_open' => true, 'open' => '08:00', 'close' => '16:30'],    // Jumat
            ['day' => 6, 'is_open' => true, 'open' => '08:00', 'close' => '14:00'],    // Sabtu
        ];

        foreach ($days as $d) {
            WorkingHour::create([
                'tenant_id' => $tenantId,
                'branch_id' => $branchId,
                'day_of_week' => $d['day'],
                'is_open' => $d['is_open'],
                'open_time' => $d['open'],
                'close_time' => $d['close'],
            ]);
        }
    }

    /** @return string[] */
    private function seedStaff(string $tenantId, string $branchId): array
    {
        $staffList = [
            ['name' => 'Rina Amalia', 'position' => 'Ahli Perawatan Wajah'],
            ['name' => 'Dewi Sartika', 'position' => 'Terapis Massage & Spa'],
            ['name' => 'Sari Indah', 'position' => 'Nail Artist'],
        ];

        $ids = [];
        foreach ($staffList as $s) {
            $staff = Staff::create([
                'tenant_id' => $tenantId,
                'branch_id' => $branchId,
                'name' => $s['name'],
                'position' => $s['position'],
                'is_active' => true,
            ]);
            $ids[] = $staff->id;
        }

        return $ids;
    }

    private function seedStaffSchedules(string $tenantId, string ...$staffIds): void
    {
        $days = [
            ['day' => 0, 'active' => false],
            ['day' => 1, 'active' => true],
            ['day' => 2, 'active' => true],
            ['day' => 3, 'active' => true],
            ['day' => 4, 'active' => true],
            ['day' => 5, 'active' => true],
            ['day' => 6, 'active' => true],
        ];

        foreach ($staffIds as $staffId) {
            foreach ($days as $d) {
                StaffSchedule::create([
                    'tenant_id' => $tenantId,
                    'staff_id' => $staffId,
                    'day_of_week' => $d['day'],
                    'is_active' => $d['active'],
                ]);
            }
        }
    }

    private function seedHolidays(string $tenantId, string $branchId): void
    {
        $holidays = [
            [
                'name' => 'Tahun Baru',
                'date_start' => date('Y') . '-01-01',
                'date_end' => date('Y') . '-01-01',
                'is_recurring_yearly' => true,
            ],
            [
                'name' => 'Hari Kemerdekaan',
                'date_start' => date('Y') . '-08-17',
                'date_end' => date('Y') . '-08-17',
                'is_recurring_yearly' => true,
            ],
            [
                'name' => 'Cuti Bersama Idul Fitri',
                'date_start' => date('Y') . '-03-30',
                'date_end' => date('Y') . '-04-02',
                'is_recurring_yearly' => false,
            ],
        ];

        foreach ($holidays as $h) {
            Holiday::create([
                'tenant_id' => $tenantId,
                'branch_id' => $branchId,
                'name' => $h['name'],
                'date_start' => $h['date_start'],
                'date_end' => $h['date_end'],
                'is_recurring_yearly' => $h['is_recurring_yearly'],
            ]);
        }
    }
}
