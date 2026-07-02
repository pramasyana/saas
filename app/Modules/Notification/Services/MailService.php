<?php

namespace App\Modules\Notification\Services;

use App\Modules\Notification\Contracts\EmailLogRepositoryInterface;
use App\Modules\Notification\Contracts\MailProvider;
use Illuminate\Support\Facades\Log;

class MailService
{
    public function __construct(
        private readonly MailProvider $provider,
        private readonly string $channel,
        private readonly EmailLogRepositoryInterface $emailLogRepository,
    ) {}

    public function send(string $toEmail, ?string $toName, string $subject, string $html, ?string $text = null, ?string $userId = null): void
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

    private function logSuccess(?string $userId, string $subject, int $attempt): void
    {
        if ($userId === null) {
            return;
        }

        $this->emailLogRepository->create([
            'user_id' => $userId,
            'channel' => $this->channel,
            'subject' => $subject,
            'status' => 'sent',
            'attempt' => $attempt,
        ]);
    }

    private function logFailure(?string $userId, string $subject, int $attempt, \Throwable $e): void
    {
        if ($userId === null) {
            return;
        }

        $this->emailLogRepository->create([
            'user_id' => $userId,
            'channel' => $this->channel,
            'subject' => $subject,
            'status' => 'failed',
            'error_message' => $e->getMessage(),
            'attempt' => $attempt,
        ]);
    }

    private function getNextAttempt(?string $userId, string $subject): int
    {
        if ($userId === null) {
            return 1;
        }

        $last = $this->emailLogRepository->getLastAttempt($userId, $subject, $this->channel);

        return $last ? $last->attempt + 1 : 1;
    }
}
