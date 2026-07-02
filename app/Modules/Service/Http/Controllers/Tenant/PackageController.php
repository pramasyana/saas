<?php

declare(strict_types=1);

namespace App\Modules\Service\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Modules\Service\Services\PackageService;
use Inertia\Inertia;
use Inertia\Response;

class PackageController extends Controller
{
    public function __construct(
        private readonly PackageService $packageService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('tenant/service/packages/Index', [
            'title' => 'Paket',
            'stats' => $this->packageService->getStats(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('tenant/service/packages/Create', [
            'title' => 'Tambah Paket',
        ]);
    }

    public function edit(string $id): Response
    {
        return Inertia::render('tenant/service/packages/Edit', [
            'title' => 'Edit Paket',
            'package' => $this->packageService->findById($id),
        ]);
    }
}
