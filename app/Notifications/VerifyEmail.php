<?php

namespace App\Notifications;

use App\Modules\Notification\Services\MailService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
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
        return ['mailtrap'];
    }

    public function toMailtrap(object $notifiable): void
    {
        $mailer = app(MailService::class);

        $subject = match ($this->context) {
            'new_account' => 'Verifikasi Email - Akun Baru',
            'resend' => 'Verifikasi Email - Pengingat',
        };

        $mailer->send(
            toEmail: $notifiable->email,
            toName: $notifiable->name,
            subject: $subject,
            html: $this->buildHtml($notifiable),
            text: $this->buildText($notifiable),
            userId: $notifiable->getKey(),
        );
    }

    private function buildHtml(object $notifiable): string
    {
        return view('emails.verify-email', [
            'name' => $notifiable->name,
            'email' => $notifiable->email,
            'verificationUrl' => $this->verificationUrl,
            'context' => $this->context,
            'expiresIn' => now()->addHour()->diffForHumans(),
        ])->render();
    }

    private function buildText(object $notifiable): string
    {
        $greeting = "Halo {$notifiable->name},";

        $body = match ($this->context) {
            'new_account' => "Akun baru telah dibuat untuk Anda. Silakan verifikasi alamat email {$notifiable->email} dengan mengklik link di bawah ini.",
            'resend' => "Anda menerima email ini karena ada permintaan verifikasi ulang untuk alamat {$notifiable->email}. Silakan verifikasi dengan mengklik link di bawah ini.",
        };

        return implode("\n\n", [
            $greeting,
            $body,
            $this->verificationUrl,
            'Tautan ini berlaku selama 1 jam.',
            '',
            'Jika Anda tidak merasa melakukan ini, abaikan email ini. Akun Anda tidak akan aktif sampai email diverifikasi.',
        ]);
    }
}
