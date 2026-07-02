<?php

declare(strict_types=1);

namespace App\Modules\Service\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Modules\Service\Services\CategoryService;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function __construct(
        private readonly CategoryService $categoryService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('tenant/service/categories/Index', [
            'title' => 'Kategori Layanan',
            'stats' => $this->categoryService->getStats(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('tenant/service/categories/Create', [
            'title' => 'Tambah Kategori',
        ]);
    }

    public function edit(string $id): Response
    {
        return Inertia::render('tenant/service/categories/Edit', [
            'title' => 'Edit Kategori',
            'category' => $this->categoryService->findById($id),
        ]);
    }
}
