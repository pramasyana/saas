<?php

namespace App\Modules\Auth\Listeners;

use App\Modules\Auth\Events\TenantRegistered;
use Illuminate\Support\Facades\Log;

class SendVerificationNotification
{
    public function handle(TenantRegistered $event): void
    {
        if ($event->user->hasVerifiedEmail()) {
            return;
        }

        try {
            $event->user->sendEmailVerificationNotification('new_account');
        } catch (\Throwable $e) {
            Log::error('Failed to send verification email', [
                'user_id' => $event->user->getKey(),
                'email' => $event->user->email,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
