<?php

namespace App\Modules\Auth\Listeners;

use App\Modules\Auth\Events\TenantRegistered;

class SendVerificationNotification
{
    public function handle(TenantRegistered $event): void
    {
        $event->user->sendEmailVerificationNotification('new_account');
    }
}
