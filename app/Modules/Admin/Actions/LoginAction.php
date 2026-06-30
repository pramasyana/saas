<?php

namespace App\Modules\Admin\Actions;

use App\Modules\Admin\Http\Requests\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class LoginAction
{
    public function execute(LoginRequest $request): RedirectResponse
    {
        return DB::transaction(function () use ($request) {
            $credentials = $request->only('email', 'password');

            if (! Auth::attempt($credentials, $request->boolean('remember'))) {
                throw ValidationException::withMessages([
                    'email' => __('auth.failed'),
                ]);
            }

            $request->session()->regenerate();

            if (! Auth::user()->is_admin) {
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                throw ValidationException::withMessages([
                    'email' => __('auth.failed'),
                ]);
            }

            Log::info('Admin login successful', [
                'user_id' => Auth::id(),
                'email' => $request->email,
                'ip' => $request->ip(),
            ]);

            return redirect()->intended(route('admin.dashboard'));
        });
    }
}
