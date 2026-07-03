<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Controllers\Public;

use App\Modules\Company\Models\Branch;
use App\Modules\Service\Contracts\PackageRepositoryInterface;
use App\Modules\Service\Models\Category;
use App\Modules\Service\Models\Service;
use App\Modules\Service\Services\PricingEngineService;
use App\Modules\Staff\Models\Staff;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LandingController
{
    public function index(Request $request): Response|RedirectResponse
    {
        if ($request->user()) {
            return redirect()->route('tenant.dashboard');
        }

        $tenant = tenant();

        if (! $tenant) {
            abort(404);
        }

        $config = $tenant->getInternal('landing_config') ?? [];
        $bookingConfig = $tenant->getInternal('booking_config') ?? [];

        if (! ($config['enabled'] ?? false)) {
            return redirect('/booking');
        }

        $tenantId = $tenant->getTenantKey();

        $categories = Category::where('is_active', true)
            ->orderBy('sort_order')
            ->get(['id', 'name', 'slug', 'color', 'sort_order']);

        $services = Service::with('category')
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'description', 'duration', 'price', 'color', 'category_id', 'branch_id'])
            ->map(fn ($s) => [
                'id' => $s->id,
                'name' => $s->name,
                'description' => $s->description,
                'duration' => $s->duration,
                'price' => (float) $s->price,
                'color' => $s->color,
                'category_id' => $s->category_id,
                'branch_id' => $s->branch_id,
                'category_name' => $s->category?->name,
                'category_color' => $s->category?->color,
            ]);

        $team = Staff::where('tenant_id', $tenantId)
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'position', 'email']);

        $packages = app(PackageRepositoryInterface::class)
            ->findAllByTenant($tenantId)
            ->load('services')
            ->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'description' => $p->description,
                'price' => (float) $p->price,
                'duration' => $p->duration,
                'branch_id' => $p->branch_id,
                'services' => $p->services->map(fn ($s) => [
                    'id' => $s->id,
                    'name' => $s->name,
                    'quantity' => $s->pivot->quantity,
                ]),
            ]);

        $branches = Branch::where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name', 'address', 'phone', 'email', 'whatsapp', 'is_default']);

        $pricingEngine = app(PricingEngineService::class);
        $pricingByBranch = [];

        foreach ($branches as $branch) {
            $items = $services->map(fn ($s) => [
                'id' => $s['id'],
                'type' => 'service',
                'price' => $s['price'],
                'category_id' => $s['category_id'],
            ])->concat($packages->map(fn ($p) => [
                'id' => $p['id'],
                'type' => 'package',
                'price' => $p['price'],
            ]))->values()->toArray();

            $result = $pricingEngine->calculate($tenantId, [
                'items' => $items,
                'branch_id' => $branch->id,
            ]);

            $pricingByBranch[$branch->id] = collect($result['items'])->keyBy(
                fn ($i) => ($i['type'] ?? 'service').'_'.$i['id']
            );
        }

        $services = $services->map(function ($s) use ($pricingByBranch) {
            $prices = [];
            foreach ($pricingByBranch as $branchId => $items) {
                $key = 'service_'.$s['id'];
                $p = $items[$key] ?? null;
                $prices[$branchId] = $p ? [
                    'original_price' => $p['original_price'],
                    'adjusted_price' => $p['adjusted_price'],
                    'discount' => $p['discount'],
                    'discount_label' => $p['discount'] > 0 && ! empty($p['applied_rules'])
                        ? static::formatDiscountLabel($p['applied_rules'][0])
                        : null,
                ] : null;
            }

            return array_merge($s, ['pricing_by_branch' => $prices]);
        });

        $packages = $packages->map(function ($p) use ($pricingByBranch) {
            $prices = [];
            foreach ($pricingByBranch as $branchId => $items) {
                $key = 'package_'.$p['id'];
                $pr = $items[$key] ?? null;
                $prices[$branchId] = $pr ? [
                    'original_price' => $pr['original_price'],
                    'adjusted_price' => $pr['adjusted_price'],
                    'discount' => $pr['discount'],
                    'discount_label' => $pr['discount'] > 0 && ! empty($pr['applied_rules'])
                        ? static::formatDiscountLabel($pr['applied_rules'][0])
                        : null,
                ] : null;
            }

            return array_merge($p, ['pricing_by_branch' => $prices]);
        });

        return Inertia::render('public/landing/index', [
            'landing' => $config,
            'categories' => $categories,
            'services' => $services,
            'team' => $team,
            'packages' => $packages,
            'branches' => $branches,
            'settings' => [
                'show_prices' => $bookingConfig['show_prices'] ?? true,
            ],
            'tenant' => [
                'name' => $tenant->company_name ?? $tenant->getInternal('name') ?? 'Booking',
                'logo' => $config['logo'] ?? null,
            ],
        ]);
    }

    private static function formatDiscountLabel(array $rule): string
    {
        return match ($rule['action_type']) {
            'percentage_discount' => 'Diskon '.(int) $rule['value'].'%',
            'fixed_discount' => 'Diskon Rp '.number_format((float) $rule['value'], 0, ',', '.'),
            'percentage_surcharge' => 'Tambahan '.(int) $rule['value'].'%',
            'fixed_surcharge' => 'Tambahan Rp '.number_format((float) $rule['value'], 0, ',', '.'),
            'price_override' => 'Harga Khusus',
            default => $rule['name'] ?? 'Diskon',
        };
    }
}
