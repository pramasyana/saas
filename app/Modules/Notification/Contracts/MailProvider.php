<?php

namespace App\Modules\Notification\Contracts;

interface MailProvider
{
    public function send(string $toEmail, ?string $toName, string $subject, string $html, ?string $text = null): void;
}
