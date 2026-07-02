<?php

declare(strict_types=1);

namespace App\Modules\Service\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Modules\Service\Services\PromotionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PromotionController extends Controller
{
    public function __construct(
        private readonly PromotionService $promotionService,
    ) {}

    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'promotion_type', 'is_active']);
        $perPage = (int) ($request->input('per_page', 15));
        $branchId = $request->input('branch_id');

        return Inertia::render('tenant/service/promotions/Index', [
            'title' => 'Promosi',
            'stats' => $this->promotionService->getStats(),
            'data' => $this->promotionService->paginate($filters, $branchId, $perPage),
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
