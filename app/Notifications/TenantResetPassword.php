<?php

namespace App\Notifications;

use App\Modules\Notification\Services\MailService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
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
        return ['mailtrap'];
    }

    public function toMailtrap(object $notifiable): void
    {
        $mailer = app(MailService::class);

        $mailer->send(
            toEmail: $notifiable->email,
            toName: $notifiable->name,
            subject: 'Reset Password - BookCRM',
            html: $this->buildHtml($notifiable),
            text: $this->buildText($notifiable),
            userId: $notifiable->getKey(),
        );
    }

    private function buildHtml(object $notifiable): string
    {
        return view('emails.reset-password', [
            'name' => $notifiable->name,
            'email' => $notifiable->email,
            'resetUrl' => $this->resetUrl,
            'expiresIn' => now()->addMinutes(60)->diffForHumans(),
        ])->render();
    }

    private function buildText(object $notifiable): string
    {
        return implode("\n\n", [
            "Halo {$notifiable->name},",
            "Anda menerima email ini karena ada permintaan reset password untuk akun {$notifiable->email}.",
            "Silakan klik link di bawah ini untuk mereset password Anda:",
            $this->resetUrl,
            'Tautan ini berlaku selama 60 menit.',
            '',
            'Jika Anda tidak merasa melakukan ini, abaikan email ini. Password Anda tetap aman.',
        ]);
    }
}
