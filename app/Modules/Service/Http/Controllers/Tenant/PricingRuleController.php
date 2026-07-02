<?php

declare(strict_types=1);

namespace App\Modules\Service\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Modules\Service\Services\PricingRuleService;
use Inertia\Inertia;
use Inertia\Response;

class PricingRuleController extends Controller
{
    public function __construct(
        private readonly PricingRuleService $pricingRuleService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('tenant/service/pricing-rules/Index', [
            'title' => 'Aturan Harga',
            'stats' => $this->pricingRuleService->getStats(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('tenant/service/pricing-rules/Create', [
            'title' => 'Tambah Aturan Harga',
        ]);
    }

    public function edit(string $id): Response
    {
        return Inertia::render('tenant/service/pricing-rules/Edit', [
            'title' => 'Edit Aturan Harga',
            'pricingRule' => $this->pricingRuleService->findById($id),
        ]);
    }
}
