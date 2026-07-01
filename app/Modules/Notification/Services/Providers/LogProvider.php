<?php

namespace App\Modules\Notification\Services\Providers;

use App\Modules\Notification\Contracts\MailProvider;
use Illuminate\Support\Facades\Log;

class LogProvider implements MailProvider
{
    public function send(string $toEmail, ?string $toName, string $subject, string $html, ?string $text = null): void
    {
        Log::info('Email logged (provider: log)', [
            'to_email' => $toEmail,
            'to_name' => $toName,
            'subject' => $subject,
            'html_length' => strlen($html),
            'text_length' => strlen($text ?? ''),
            'service' => 'log',
        ]);
    }
}
