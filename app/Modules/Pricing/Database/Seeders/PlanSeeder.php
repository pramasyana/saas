<?php

namespace App\Modules\Pricing\Database\Seeders;

use App\Modules\Pricing\Models\FeatureDefinition;
use App\Modules\Pricing\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $features = FeatureDefinition::all()->keyBy('key');

        $plans = [
            [
                'name' => 'Free',
                'slug' => 'free',
                'description' => 'Cara gratis untuk memulai. Cocok untuk mencoba platform kami.',
                'price_monthly' => 0,
                'price_yearly' => null,
                'is_active' => true,
                'sort_order' => 1,
                'features' => [
                    'max_orders' => '50',
                    'order_management' => 'true',
                    'order_form' => 'true',
                    'landing_page' => 'true',
                    'custom_domain' => 'false',
                    'priority_support' => 'false',
                    'max_staff' => '1',
                    'api_access' => 'false',
                    'max_products' => '10',
                    'analytics' => 'false',
                    'whatsapp_notification' => 'false',
                ],
            ],
            [
                'name' => 'Basic',
                'slug' => 'basic',
                'description' => 'Paket dasar untuk bisnis kecil yang sedang tumbuh.',
                'price_monthly' => 99000,
                'price_yearly' => 999000,
                'is_active' => true,
                'sort_order' => 2,
                'features' => [
                    'max_orders' => '500',
                    'order_management' => 'true',
                    'order_form' => 'true',
                    'landing_page' => 'true',
                    'custom_domain' => 'true',
                    'priority_support' => 'false',
                    'max_staff' => '3',
                    'api_access' => 'true',
                    'max_products' => '50',
                    'analytics' => 'true',
                    'whatsapp_notification' => 'false',
                ],
            ],
            [
                'name' => 'Pro',
                'slug' => 'pro',
                'description' => 'Paket profesional untuk bisnis dengan skala menengah.',
                'price_monthly' => 299000,
                'price_yearly' => 2999000,
                'is_active' => true,
                'is_popular' => true,
                'sort_order' => 3,
                'features' => [
                    'max_orders' => '5000',
                    'order_management' => 'true',
                    'order_form' => 'true',
                    'landing_page' => 'true',
                    'custom_domain' => 'true',
                    'priority_support' => 'true',
                    'max_staff' => '10',
                    'api_access' => 'true',
                    'max_products' => '500',
                    'analytics' => 'true',
                    'whatsapp_notification' => 'true',
                ],
            ],
            [
                'name' => 'Enterprise',
                'slug' => 'enterprise',
                'description' => 'Solusi enterprise untuk bisnis besar dengan kebutuhan khusus.',
                'price_monthly' => 999000,
                'price_yearly' => 9999000,
                'is_active' => true,
                'sort_order' => 4,
                'features' => [
                    'max_orders' => '999999',
                    'order_management' => 'true',
                    'order_form' => 'true',
                    'landing_page' => 'true',
                    'custom_domain' => 'true',
                    'priority_support' => 'true',
                    'max_staff' => '999',
                    'api_access' => 'true',
                    'max_products' => '99999',
                    'analytics' => 'true',
                    'whatsapp_notification' => 'true',
                ],
            ],
        ];

        foreach ($plans as $planData) {
            $planFeatures = $planData['features'];
            unset($planData['features']);

            $plan = Plan::create($planData);

            foreach ($planFeatures as $key => $value) {
                if (isset($features[$key])) {
                    $plan->features()->create([
                        'feature_definition_id' => $features[$key]->id,
                        'value' => $value,
                    ]);
                }
            }
        }
    }
}
