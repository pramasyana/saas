<?php

namespace App\Modules\Auth\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class TenantResetPasswordController extends Controller
{
    public function create(string $token): Response
    {
        return Inertia::render('auth/reset-password', [
            'token' => $token,
            'email' => request('email'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => ['required', 'confirmed', PasswordRule::defaults()],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();

                $user->tokens()->delete();
            },
        );

        if ($status === Password::PASSWORD_RESET) {
            return redirect()->route('tenant.login')
                ->with('success', 'Password has been reset. Please sign in with your new password.');
        }

        throw ValidationException::withMessages([
            'email' => [trans($status)],
        ]);
    }
}
