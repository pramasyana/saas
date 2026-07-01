<?php

namespace App\Modules\Notification\Services;

use App\Modules\Notification\Contracts\MailProvider;

class MailService
{
    public function __construct(
        private readonly MailProvider $provider,
    ) {}

    public function send(string $toEmail, ?string $toName, string $subject, string $html, ?string $text = null): void
    {
        $this->provider->send($toEmail, $toName, $subject, $html, $text);
    }
}
