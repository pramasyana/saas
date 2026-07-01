<?php

namespace App\Modules\Auth\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Auth\Actions\TenantLoginAction;
use App\Modules\Auth\Http\Requests\TenantLoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function createLogin(): Response
    {
        return Inertia::render('auth/login');
    }

    public function storeLogin(TenantLoginRequest $request, TenantLoginAction $action): RedirectResponse
    {
        return $action->execute($request);
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('tenant.login');
    }

    public function verificationNotice(): Response
    {
        return Inertia::render('auth/verification-notice');
    }
}
