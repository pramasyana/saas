<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VerifyEmail extends Notification implements ShouldQueue
{
    use Queueable;

    /** @var 'new_account'|'resend' */
    private readonly string $context;

    public function __construct(
        private readonly string $verificationUrl,
        string $context = 'new_account',
    ) {
        $this->context = in_array($context, ['new_account', 'resend']) ? $context : 'new_account';
    }

    public function backoff(): array
    {
        return [10, 30, 60, 180, 600];
    }

    public function retryUntil(): \DateTime
    {
        return now()->addHour()->toDateTime();
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $subject = match ($this->context) {
            'new_account' => 'Verifikasi Email - Akun Baru',
            'resend' => 'Verifikasi Email - Pengingat',
        };

        return (new MailMessage)
            ->subject($subject)
            ->view('emails.verify-email', [
                'name' => $notifiable->name,
                'email' => $notifiable->email,
                'verificationUrl' => $this->verificationUrl,
                'context' => $this->context,
                'expiresIn' => now()->addHour()->diffForHumans(),
            ]);
    }
}
