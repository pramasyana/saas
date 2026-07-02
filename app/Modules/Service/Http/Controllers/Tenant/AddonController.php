<?php

declare(strict_types=1);

namespace App\Modules\Service\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Modules\Service\Services\AddonService;
use Inertia\Inertia;
use Inertia\Response;

class AddonController extends Controller
{
    public function __construct(
        private readonly AddonService $addonService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('tenant/service/addons/Index', [
            'title' => 'Add-on',
            'stats' => $this->addonService->getStats(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('tenant/service/addons/Create', [
            'title' => 'Tambah Add-on',
        ]);
    }

    public function edit(string $id): Response
    {
        return Inertia::render('tenant/service/addons/Edit', [
            'title' => 'Edit Add-on',
            'addon' => $this->addonService->findById($id),
        ]);
    }
}
