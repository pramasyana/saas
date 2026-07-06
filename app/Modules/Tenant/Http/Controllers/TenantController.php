<?php

declare(strict_types=1);

namespace App\Modules\Tenant\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Modules\Subscription\Models\Subscription;
use App\Modules\Tenant\Contracts\TenantRepositoryInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TenantController extends Controller
{
    public function __construct(
        private readonly TenantRepositoryInterface $tenantRepository,
    ) {}

    public function index(Request $request): Response
    {
        return Inertia::render('admin/tenants/index', [
            'title' => 'Tenants',
            'stats' => $this->tenantRepository->getStats(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/tenants/Create', [
            'title' => 'Tambah Tenant',
        ]);
    }

    public function show(string $id): Response
    {
        $tenant = Tenant::with(['domains', 'user'])
            ->withCount(['users', 'subscriptions'])
            ->findOrFail($id);

        $subscription = Subscription::with('plan')
            ->where('tenant_id', $id)
            ->where('status', 'active')
            ->first();

        return Inertia::render('admin/tenants/Show', [
            'title' => $tenant->company_name ?? 'Detail Tenant',
            'tenant' => [
                'id' => $tenant->id,
                'name' => $tenant->company_name,
                'email' => $tenant->company_email,
                'phone' => $tenant->company_phone,
                'domains' => $tenant->domains->pluck('domain'),
                'users_count' => $tenant->users_count,
                'subscriptions_count' => $tenant->subscriptions_count,
                'created_at' => $tenant->created_at?->format('d M Y H:i'),
                'user' => $tenant->user ? [
                    'id' => $tenant->user->id,
                    'name' => $tenant->user->name,
                    'email' => $tenant->user->email,
                ] : null,
            ],
            'subscription' => $subscription ? [
                'id' => $subscription->id,
                'plan_name' => $subscription->plan?->name,
                'plan_slug' => $subscription->plan?->slug,
                'price_amount' => (float) $subscription->price_amount,
                'billing_interval' => $subscription->billing_interval,
                'status' => $subscription->status,
                'starts_at' => $subscription->starts_at?->format('d M Y'),
                'ends_at' => $subscription->ends_at?->format('d M Y'),
            ] : null,
        ]);
    }

    public function edit(string $id): Response
    {
        $tenant = $this->tenantRepository->findByIdWithRelations($id);

        abort_unless((bool) $tenant, 404);

        return Inertia::render('admin/tenants/Edit', [
            'title' => 'Edit Tenant',
            'tenant' => [
                'id' => $tenant->id,
                'name' => $tenant->company_name,
                'email' => $tenant->company_email,
                'phone' => $tenant->company_phone,
                'domains' => $tenant->domains->pluck('domain'),
                'user' => $tenant->user ? [
                    'id' => $tenant->user->id,
                    'name' => $tenant->user->name,
                    'email' => $tenant->user->email,
                ] : null,
            ],
        ]);
    }
}
