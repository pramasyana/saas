<?php

namespace App\Notifications;

use App\Modules\Notification\Services\MailService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class VerifyEmail extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private readonly string $verificationUrl,
    ) {}

    public function backoff(): array
    {
        return [10, 30, 60, 180, 600];
    }

    public function retryUntil(): \DateTime
    {
        return now()->addHour();
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
            subject: 'Verifikasi Email - ' . config('app.name'),
            html: $this->buildHtml($notifiable),
            text: $this->buildText($notifiable),
        );
    }

    private function buildHtml(object $notifiable): string
    {
        return view('emails.verify-email', [
            'appName' => config('app.name'),
            'name' => $notifiable->name,
            'verificationUrl' => $this->verificationUrl,
        ])->render();
    }

    private function buildText(object $notifiable): string
    {
        $appName = config('app.name');

        return "Halo {$notifiable->name},\n\n"
            . "Terima kasih telah mendaftar di {$appName}. Silakan verifikasi alamat email Anda dengan mengklik link berikut:\n\n"
            . "{$this->verificationUrl}\n\n"
            . "Jika Anda tidak membuat akun ini, abaikan email ini.\n";
    }
}
