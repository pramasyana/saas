<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TenantResetPassword extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private readonly string $resetUrl,
    ) {}

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
        return (new MailMessage)
            ->subject('Reset Password - Nusentra')
            ->view('emails.reset-password', [
                'name' => $notifiable->name,
                'email' => $notifiable->email,
                'resetUrl' => $this->resetUrl,
                'expiresIn' => now()->addMinutes(60)->diffForHumans(),
            ]);
    }
}
