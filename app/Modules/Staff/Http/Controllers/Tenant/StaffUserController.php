<?php

declare(strict_types=1);

namespace App\Modules\Staff\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class StaffUserController extends Controller
{
    public function index(): Response
    {
        $tenantId = auth()->user()->tenant_id;

        $query = User::where('tenant_id', $tenantId);

        return Inertia::render('tenant/staff/users/index', [
            'title' => 'Kelola User',
            'stats' => [
                'total' => (clone $query)->count(),
                'active' => (clone $query)->where('is_active', true)->count(),
                'unverified' => (clone $query)->whereNull('email_verified_at')->count(),
                'new_this_month' => (clone $query)->whereMonth('created_at', now()->month)->count(),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('tenant/staff/users/Create', [
            'title' => 'Tambah User',
        ]);
    }

    public function edit(string $id): Response
    {
        return Inertia::render('tenant/staff/users/Edit', [
            'title' => 'Edit User',
            'user' => User::findOrFail($id),
        ]);
    }
}
