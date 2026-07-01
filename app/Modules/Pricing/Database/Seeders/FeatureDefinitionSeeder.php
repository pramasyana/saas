<?php

namespace App\Modules\Pricing\Database\Seeders;

use App\Modules\Pricing\Models\FeatureDefinition;
use Illuminate\Database\Seeder;

class FeatureDefinitionSeeder extends Seeder
{
    public function run(): void
    {
        $features = [
            ['key' => 'max_orders', 'label' => 'Max Orders/Bulan', 'type' => 'numeric', 'default_value' => '0', 'category' => 'limits', 'sort_order' => 1],
            ['key' => 'order_management', 'label' => 'Order Management', 'type' => 'boolean', 'default_value' => 'false', 'category' => 'features', 'sort_order' => 2],
            ['key' => 'order_form', 'label' => 'Order Form', 'type' => 'boolean', 'default_value' => 'false', 'category' => 'features', 'sort_order' => 3],
            ['key' => 'landing_page', 'label' => 'Landing Page', 'type' => 'boolean', 'default_value' => 'false', 'category' => 'features', 'sort_order' => 4],
            ['key' => 'custom_domain', 'label' => 'Custom Domain', 'type' => 'boolean', 'default_value' => 'false', 'category' => 'customization', 'sort_order' => 5],
            ['key' => 'priority_support', 'label' => 'Priority Support', 'type' => 'boolean', 'default_value' => 'false', 'category' => 'support', 'sort_order' => 6],
            ['key' => 'max_staff', 'label' => 'Max Staff Accounts', 'type' => 'numeric', 'default_value' => '0', 'category' => 'limits', 'sort_order' => 7],
            ['key' => 'api_access', 'label' => 'API Access', 'type' => 'boolean', 'default_value' => 'false', 'category' => 'features', 'sort_order' => 8],
            ['key' => 'max_products', 'label' => 'Max Products', 'type' => 'numeric', 'default_value' => '0', 'category' => 'limits', 'sort_order' => 9],
            ['key' => 'analytics', 'label' => 'Analytics & Reports', 'type' => 'boolean', 'default_value' => 'false', 'category' => 'features', 'sort_order' => 10],
            ['key' => 'whatsapp_notification', 'label' => 'WhatsApp Notification', 'type' => 'boolean', 'default_value' => 'false', 'category' => 'features', 'sort_order' => 11],
        ];

        foreach ($features as $feature) {
            FeatureDefinition::firstOrCreate(
                ['key' => $feature['key']],
                $feature,
            );
        }
    }
}
