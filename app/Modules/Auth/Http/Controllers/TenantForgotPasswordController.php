<?php

namespace App\Modules\Auth\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Notifications\TenantResetPassword;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class TenantForgotPasswordController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('auth/forgot-password');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $status = Password::sendResetLink(
            $request->only('email'),
            function ($user, $token) {
                $url = url("/reset-password/{$token}?email={$user->getEmailForPasswordReset()}");
                $user->notify(new TenantResetPassword($url));
            },
        );

        if ($status === Password::RESET_LINK_SENT) {
            return back()->with('success', 'Reset link has been sent to your email.');
        }

        throw ValidationException::withMessages([
            'email' => [trans($status)],
        ]);
    }
}
