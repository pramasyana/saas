<?php

declare(strict_types=1);

namespace App\Modules\Company\Services;

use App\Modules\Company\Actions\UpdateCompanyBrandingAction;
use App\Modules\Company\Actions\UpdateCompanyProfileAction;
use App\Modules\Company\Contracts\BranchRepositoryInterface;
use App\Modules\Company\Contracts\CompanyBrandingRepositoryInterface;
use App\Modules\Company\Contracts\CompanyProfileRepositoryInterface;
use App\Modules\Company\Contracts\HolidayRepositoryInterface;
use App\Modules\Company\Contracts\WorkingHourRepositoryInterface;
use App\Modules\Company\Events\BranchCreated;
use App\Modules\Company\Events\BranchDeleted;
use App\Modules\Company\Events\BranchUpdated;
use App\Modules\Company\Models\Branch;
use App\Modules\Company\Models\CompanyBranding;
use App\Modules\Company\Models\CompanyProfile;
use App\Modules\Company\Models\Holiday;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class CompanyService
{
    public function __construct(
        private readonly CompanyProfileRepositoryInterface $companyProfileRepository,
        private readonly CompanyBrandingRepositoryInterface $companyBrandingRepository,
        private readonly BranchRepositoryInterface $branchRepository,
        private readonly WorkingHourRepositoryInterface $workingHourRepository,
        private readonly HolidayRepositoryInterface $holidayRepository,
        private readonly UpdateCompanyProfileAction $updateCompanyProfileAction,
        private readonly UpdateCompanyBrandingAction $updateCompanyBrandingAction,
    ) {}

    public function getProfile(string $tenantId): array
    {
        $profile = $this->companyProfileRepository->findByTenantId($tenantId);

        return [
            'profile' => $profile,
        ];
    }

    public function updateProfile(string $tenantId, array $data): CompanyProfile
    {
        return $this->updateCompanyProfileAction->execute($tenantId, $data);
    }

    public function getBranding(string $tenantId): array
    {
        $branding = $this->companyBrandingRepository->findByTenantId($tenantId);

        return [
            'branding' => $branding,
        ];
    }

    public function updateBranding(string $tenantId, array $data): CompanyBranding
    {
        return $this->updateCompanyBrandingAction->execute($tenantId, $data);
    }

    public function findBranch(string $tenantId, string $id): Branch
    {
        $branch = $this->branchRepository->findById($id);

        if (! $branch) {
            throw new RuntimeException('Cabang tidak ditemukan.');
        }

        return $branch;
    }

    public function getBranches(string $tenantId, array $filters): LengthAwarePaginator
    {
        return $this->branchRepository->findAllByTenant($tenantId, $filters);
    }

    public function createBranch(string $tenantId, array $data): Branch
    {
        return DB::transaction(function () use ($tenantId, $data) {
            $data['tenant_id'] = $tenantId;

            $branch = $this->branchRepository->create($data);

            BranchCreated::dispatch($tenantId, $branch);

            return $branch;
        });
    }

    public function updateBranch(string $tenantId, string $id, array $data): Branch
    {
        return DB::transaction(function () use ($tenantId, $id, $data) {
            $branch = $this->findBranchOrFail($id);

            $branch = $this->branchRepository->update($branch, $data);

            BranchUpdated::dispatch($tenantId, $branch);

            return $branch;
        });
    }

    public function deleteBranch(string $tenantId, string $id): void
    {
        DB::transaction(function () use ($tenantId, $id) {
            $branch = $this->findBranchOrFail($id);

            if ($branch->is_default) {
                throw new RuntimeException('Cabang utama tidak dapat dihapus.');
            }

            $this->branchRepository->delete($branch);

            BranchDeleted::dispatch($tenantId, $branch);
        });
    }

    public function getWorkingHours(string $tenantId, ?string $branchId): Collection
    {
        return $this->workingHourRepository->findAllByTenant($tenantId, $branchId);
    }

    public function updateWorkingHours(string $tenantId, array $hours, ?string $branchId = null): void
    {
        DB::transaction(function () use ($tenantId, $hours, $branchId) {
            foreach ($hours as $hour) {
                $this->workingHourRepository->updateOrCreate(
                    $tenantId,
                    (int) $hour['day_of_week'],
                    [
                        'is_open' => $hour['is_open'] ?? true,
                        'open_time' => $hour['open_time'] ?? null,
                        'close_time' => $hour['close_time'] ?? null,
                        'break_start' => $hour['break_start'] ?? null,
                        'break_end' => $hour['break_end'] ?? null,
                    ],
                    $branchId,
                );
            }
        });
    }

    public function getHolidays(string $tenantId, array $filters): LengthAwarePaginator
    {
        return $this->holidayRepository->findAllByTenant($tenantId, $filters);
    }

    public function createHoliday(string $tenantId, array $data): Holiday
    {
        return DB::transaction(function () use ($tenantId, $data) {
            $data['tenant_id'] = $tenantId;

            return $this->holidayRepository->create($data);
        });
    }

    public function updateHoliday(string $tenantId, string $id, array $data): Holiday
    {
        return DB::transaction(function () use ($id, $data) {
            $holiday = $this->findHolidayOrFail($id);

            return $this->holidayRepository->update($holiday, $data);
        });
    }

    public function deleteHoliday(string $tenantId, string $id): void
    {
        DB::transaction(function () use ($id) {
            $holiday = $this->findHolidayOrFail($id);

            $this->holidayRepository->delete($holiday);
        });
    }

    private function findBranchOrFail(string $id): Branch
    {
        $branch = $this->branchRepository->findById($id);

        if (! $branch) {
            throw new RuntimeException('Cabang tidak ditemukan.');
        }

        return $branch;
    }

    private function findHolidayOrFail(string $id): Holiday
    {
        $holiday = $this->holidayRepository->findById($id);

        if (! $holiday) {
            throw new RuntimeException('Hari libur tidak ditemukan.');
        }

        return $holiday;
    }
}
