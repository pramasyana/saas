<?php

namespace App\Modules\Notification\Providers;

use App\Modules\Notification\Contracts\EmailLogRepositoryInterface;
use App\Modules\Notification\Contracts\MailProvider;
use App\Modules\Notification\Repositories\EmailLogRepository;
use App\Modules\Notification\Services\MailService;
use App\Modules\Notification\Services\Providers\LogProvider;
use App\Modules\Notification\Services\Providers\MailtrapProvider;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\ServiceProvider;

class NotificationServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(EmailLogRepositoryInterface::class, EmailLogRepository::class);

        $this->app->singleton(MailProvider::class, fn () => $this->resolveProvider());

        $this->app->singleton(MailService::class, fn ($app) => new MailService(
            provider: $app->make(MailProvider::class),
            channel: config('mail-provider.default', 'log'),
            emailLogRepository: $app->make(EmailLogRepositoryInterface::class),
        ));
    }

    public function boot(): void
    {
        Notification::extend('mailtrap', function ($app) {
            return new class($app->make(MailService::class))
            {
                public function __construct(private MailService $mailer) {}

                public function send(object $notifiable, \Illuminate\Notifications\Notification $notification): void
                {
                    $notification->toMailtrap($notifiable);
                }
            };
        });
    }

    private function resolveProvider(): MailProvider
    {
        return match (config('mail-provider.default')) {
            'mailtrap' => new MailtrapProvider,
            'log' => new LogProvider,
            default => throw new \RuntimeException('Unknown mail provider: '.config('mail-provider.default')),
        };
    }
}
