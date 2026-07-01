<?php

namespace App\Modules\Auth\Actions;

use App\Modules\Auth\Http\Requests\TenantLoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class TenantLoginAction
{
    public function execute(TenantLoginRequest $request): RedirectResponse
    {
        return DB::transaction(function () use ($request) {
            if (! Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
                throw ValidationException::withMessages([
                    'email' => __('auth.failed'),
                ]);
            }

            $request->session()->regenerate();

            if (Auth::user()->email_verified_at === null) {
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                throw ValidationException::withMessages([
                    'email' => 'Email belum diverifikasi. Silakan cek email Anda.',
                ]);
            }

            if (! Auth::user()->is_active) {
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                throw ValidationException::withMessages([
                    'email' => __('auth.failed'),
                ]);
            }

            if (Auth::user()->is_admin) {
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                throw ValidationException::withMessages([
                    'email' => __('auth.failed'),
                ]);
            }

            return redirect()->intended(route('tenant.dashboard'));
        });
    }
}
