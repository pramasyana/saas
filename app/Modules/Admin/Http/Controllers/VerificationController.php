<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VerificationController extends Controller
{
    public function verify(Request $request, int $id, string $hash): RedirectResponse|Response
    {
        $user = User::findOrFail($id);

        if (! hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            abort(403, 'Link verifikasi tidak valid.');
        }

        if ($user->hasVerifiedEmail()) {
            return Inertia::render('admin/verification-success', [
                'title' => 'Email Terverifikasi',
                'message' => 'Email Anda sudah diverifikasi sebelumnya.',
            ]);
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return Inertia::render('admin/verification-success', [
            'title' => 'Email Terverifikasi',
            'message' => 'Selamat! Email Anda berhasil diverifikasi. Anda sekarang dapat login.',
        ]);
    }
}
