<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Modules\Booking\Contracts\BookingReminderRepositoryInterface;
use App\Modules\Booking\Services\BookingService;
use App\Modules\Company\Models\Branch;
use App\Modules\Service\Contracts\PackageRepositoryInterface;
use App\Modules\Service\Models\Category;
use App\Modules\Service\Models\Service;
use App\Modules\Service\Services\PricingEngineService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function __construct(
        private readonly BookingService $bookingService,
        private readonly BookingReminderRepositoryInterface $reminderRepository,
    ) {}

    public function index(Request $request): Response
    {
        $stats = $this->bookingService->getStats();

        return Inertia::render('tenant/booking/Index', [
            'title' => 'Booking',
            'stats' => $stats,
        ]);
    }

    public function walkIn(): Response
    {
        return Inertia::render('tenant/booking/WalkIn', [
            'title' => 'Walk In Booking',
        ]);
    }

    public function waitingList(): Response
    {
        return Inertia::render('tenant/booking/WaitingList', [
            'title' => 'Waiting List',
        ]);
    }

    public function online(): Response
    {
        $tenant = tenant();
        $config = $tenant->getInternal('booking_config') ?? [];
        $domain = $tenant->domains()->first()?->domain ?? '';

        return Inertia::render('tenant/booking/Online', [
            'title' => 'Online Booking',
            'settings' => [
                'enabled' => $config['enabled'] ?? false,
                'show_prices' => $config['show_prices'] ?? true,
                'auto_confirm' => $config['auto_confirm'] ?? false,
            ],
            'publicUrl' => 'https://'.$domain.'/booking',
        ]);
    }

    public function reminders(): Response
    {
        $tenantId = tenant()->getTenantKey();
        $reminders = $this->reminderRepository->findByTenant($tenantId);

        return Inertia::render('tenant/booking/Reminders', [
            'title' => 'Monitoring Reminder',
            'stats' => [
                'total' => $reminders->count(),
                'pending' => $reminders->where('status', 'pending')->count(),
                'sent' => $reminders->where('status', 'sent')->count(),
                'failed' => $reminders->where('status', 'failed')->count(),
            ],
        ]);
    }

    public function landing(): Response
    {
        $tenant = tenant();
        $domain = $tenant->domains()->first()?->domain ?? '';

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

        $tenantId = $tenant->getTenantKey();

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
            ->get(['id', 'name', 'address', 'phone', 'email', 'whatsapp', 'map_embed_url', 'latitude', 'longitude', 'is_default']);

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
                        ? self::formatDiscountLabel($p['applied_rules'][0])
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
                        ? self::formatDiscountLabel($pr['applied_rules'][0])
                        : null,
                ] : null;
            }

            return array_merge($p, ['pricing_by_branch' => $prices]);
        });

        return Inertia::render('tenant/booking/LandingSettings', [
            'title' => 'Landing Page',
            'publicUrl' => 'https://'.$domain,
            'categories' => $categories,
            'services' => $services,
            'packages' => $packages,
            'branches' => $branches,
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
