<?php

declare(strict_types=1);

namespace App\Modules\Crm\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Modules\Crm\Services\CustomerService;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function __construct(
        private readonly CustomerService $customerService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('tenant/crm/customers/Index', [
            'title' => 'Customers',
            'stats' => $this->customerService->getStats(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('tenant/crm/customers/Create', [
            'title' => 'Tambah Customer',
        ]);
    }

    public function show(string $id): Response
    {
        return Inertia::render('tenant/crm/customers/Show', [
            'title' => 'Detail Customer',
            'customer' => $this->customerService->findOrFail($id),
        ]);
    }

    public function edit(string $id): Response
    {
        return Inertia::render('tenant/crm/customers/Edit', [
            'title' => 'Edit Customer',
            'customer' => $this->customerService->findOrFail($id),
        ]);
    }
}
