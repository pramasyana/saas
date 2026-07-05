<?php

declare(strict_types=1);

namespace App\Modules\Crm\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class CustomerMembershipController extends Controller
{
    public function plans(): Response
    {
        return Inertia::render('tenant/crm/membership-plans/Index', [
            'title' => 'Paket Membership',
        ]);
    }

    public function createPlan(): Response
    {
        return Inertia::render('tenant/crm/membership-plans/Create', [
            'title' => 'Tambah Paket Membership',
        ]);
    }

    public function editPlan(string $id): Response
    {
        return Inertia::render('tenant/crm/membership-plans/Edit', [
            'title' => 'Edit Paket Membership',
            'planId' => $id,
        ]);
    }

    public function subscriptions(): Response
    {
        return Inertia::render('tenant/crm/customer-subscriptions/Index', [
            'title' => 'Langganan Customer',
        ]);
    }
}
