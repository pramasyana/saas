<?php

declare(strict_types=1);

namespace App\Modules\Setting\Database\Seeders;

use App\Modules\Setting\Models\TenantSetting;
use Illuminate\Database\Seeder;

class TenantSettingSeeder extends Seeder
{
    public function run(): void
    {
        $tenantId = tenant()->getTenantKey();

        $settings = [
            ['key' => 'booking.slot_interval', 'value' => '30', 'type' => 'integer', 'group' => 'booking'],
            ['key' => 'booking.code_prefix', 'value' => 'BK-', 'type' => 'string', 'group' => 'booking'],
            ['key' => 'booking.sources', 'value' => '["online","walk_in","recurring"]', 'type' => 'json', 'group' => 'booking'],
            ['key' => 'room.default_color', 'value' => '#7C3AED', 'type' => 'color', 'group' => 'room'],
            ['key' => 'recurring.enabled', 'value' => 'true', 'type' => 'boolean', 'group' => 'recurring'],
            ['key' => 'recurring.generate_at', 'value' => '03:00', 'type' => 'string', 'group' => 'recurring'],
            ['key' => 'recurring.generate_interval', 'value' => '1', 'type' => 'integer', 'group' => 'recurring'],
            ['key' => 'booking.enable_staff_filter', 'value' => 'true', 'type' => 'boolean', 'group' => 'booking'],
            ['key' => 'booking.enable_rooms', 'value' => 'false', 'type' => 'boolean', 'group' => 'booking'],
            ['key' => 'booking.enable_group_booking', 'value' => 'false', 'type' => 'boolean', 'group' => 'booking'],
            ['key' => 'booking.enable_recurring_public', 'value' => 'false', 'type' => 'boolean', 'group' => 'booking'],
        ];

        foreach ($settings as $s) {
            TenantSetting::updateOrCreate(
                ['key' => $s['key'], 'tenant_id' => $tenantId],
                $s,
            );
        }
    }
}
