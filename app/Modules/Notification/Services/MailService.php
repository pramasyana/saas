<?php

namespace App\Modules\Notification\Services;

use App\Modules\Notification\Contracts\MailProvider;
use App\Modules\Notification\Models\EmailLog;
use Illuminate\Support\Facades\Log;

class MailService
{
    public function __construct(
        private readonly MailProvider $provider,
        private readonly string $channel,
    ) {}

    public function send(string $toEmail, ?string $toName, string $subject, string $html, ?string $text = null, ?int $userId = null): void
    {
        $attempt = $this->getNextAttempt($userId, $subject);

        try {
            $this->provider->send($toEmail, $toName, $subject, $html, $text);

            $this->logSuccess($userId, $subject, $attempt);
        } catch (\Throwable $e) {
            $this->logFailure($userId, $subject, $attempt, $e);

            Log::warning('Email send failed', [
                'to_email' => $toEmail,
                'subject' => $subject,
                'channel' => $this->channel,
                'attempt' => $attempt,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    private function logSuccess(?int $userId, string $subject, int $attempt): void
    {
        if ($userId === null) {
            return;
        }

        EmailLog::create([
            'user_id' => $userId,
            'channel' => $this->channel,
            'subject' => $subject,
            'status' => 'sent',
            'attempt' => $attempt,
        ]);
    }

    private function logFailure(?int $userId, string $subject, int $attempt, \Throwable $e): void
    {
        if ($userId === null) {
            return;
        }

        EmailLog::create([
            'user_id' => $userId,
            'channel' => $this->channel,
            'subject' => $subject,
            'status' => 'failed',
            'error_message' => $e->getMessage(),
            'attempt' => $attempt,
        ]);
    }

    private function getNextAttempt(?int $userId, string $subject): int
    {
        if ($userId === null) {
            return 1;
        }

        $last = EmailLog::where('user_id', $userId)
            ->where('subject', $subject)
            ->where('channel', $this->channel)
            ->latest()
            ->first();

        return $last ? $last->attempt + 1 : 1;
    }
}
