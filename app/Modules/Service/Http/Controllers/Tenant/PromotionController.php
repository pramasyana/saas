<?php

declare(strict_types=1);

namespace App\Modules\Service\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Modules\Service\Services\PromotionService;
use Inertia\Inertia;
use Inertia\Response;

class PromotionController extends Controller
{
    public function __construct(
        private readonly PromotionService $promotionService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('tenant/service/promotions/Index', [
            'title' => 'Promosi',
            'stats' => $this->promotionService->getStats(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('tenant/service/promotions/Create', [
            'title' => 'Tambah Promosi',
        ]);
    }

    public function edit(string $id): Response
    {
        return Inertia::render('tenant/service/promotions/Edit', [
            'title' => 'Edit Promosi',
            'promotion' => $this->promotionService->findById($id),
        ]);
    }
}
