<?php

namespace App\Modules\Admin\DTOs;

class DashboardStatsDTO
{
    public function __construct(
        public readonly int $total_users,
        public readonly int $new_today,
        public readonly int $new_this_week,
        public readonly int $new_this_month,
        public readonly int $total_admins,
        public readonly float $user_growth,
        public readonly int $total_tenants = 0,
        public readonly int $new_tenants_this_month = 0,
    ) {}

    /** @return array<string, mixed> */
    public function toArray(): array
    {
        return [
            'total_users' => $this->total_users,
            'new_today' => $this->new_today,
            'new_this_week' => $this->new_this_week,
            'new_this_month' => $this->new_this_month,
            'total_admins' => $this->total_admins,
            'user_growth' => $this->user_growth,
            'total_tenants' => $this->total_tenants,
            'new_tenants_this_month' => $this->new_tenants_this_month,
        ];
    }
}
