<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\User;
use App\Modules\Admin\Services\ActivityLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;

class ImpersonationController extends Controller
{
    public function __construct(
        private readonly ActivityLogService $logService,
    ) {}

    public function store(Request $request, string $tenantId): RedirectResponse
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $admin = Auth::user();

        if (! $admin || ! $admin->is_admin) {
            return redirect()->back()->withErrors(['password' => 'Unauthorized.']);
        }

        if (! Hash::check($request->input('password'), $admin->password)) {
            return redirect()->back()->withErrors(['password' => 'Password salah.']);
        }

        $tenant = Tenant::findOrFail($tenantId);

        $targetUser = $tenant->user;

        if (! $targetUser) {
            return redirect()->back()->withErrors(['password' => 'Tenant ini tidak memiliki pemilik.']);
        }

        Session::put('impersonator_id', $admin->id);
        Session::put('impersonator_tenant_id', $tenantId);

        Auth::login($targetUser);

        $this->logService->logFromRequest($request, 'impersonated', 'Login sebagai tenant: '.$tenant->getInternal('name'), 'tenant', $tenantId);

        return redirect()->route('tenant.dashboard');
    }

    public function leave(): RedirectResponse
    {
        $impersonatorId = Session::pull('impersonator_id');
        Session::pull('impersonator_tenant_id');

        if (! $impersonatorId) {
            return redirect('/');
        }

        $admin = User::find($impersonatorId);

        if (! $admin) {
            Auth::logout();

            return redirect('/');
        }

        Auth::login($admin);

        return redirect()->route('admin.tenants.show', Session::pull('impersonator_tenant_id') ?? '');
    }
}
