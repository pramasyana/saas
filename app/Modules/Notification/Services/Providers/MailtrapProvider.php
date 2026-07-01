<?php

namespace App\Modules\Notification\Services\Providers;

use App\Modules\Notification\Contracts\MailProvider;
use Illuminate\Support\Facades\Log;
use Mailtrap\Api\EmailsSendApiInterface;
use Mailtrap\Exception\HttpClientException;
use Mailtrap\MailtrapClient;
use Mailtrap\Mime\MailtrapEmail;
use Symfony\Component\Mime\Address;

class MailtrapProvider implements MailProvider
{
    private EmailsSendApiInterface $client;

    private string $fromAddress;

    private string $fromName;

    public function __construct()
    {
        $config = config('mail-provider.providers.mailtrap');

        $this->client = MailtrapClient::initSendingEmails(
            apiKey: $config['api_key'],
        );

        $this->fromAddress = $config['from']['address'];
        $this->fromName = $config['from']['name'];
    }

    public function send(string $toEmail, ?string $toName, string $subject, string $html, ?string $text = null): void
    {
        $email = (new MailtrapEmail())
            ->from(new Address($this->fromAddress, $this->fromName))
            ->to(new Address($toEmail, $toName ?? $toEmail))
            ->subject($subject)
            ->html($html);

        if ($text) {
            $email->text($text);
        }

        try {
            $this->client->send($email);

            Log::info('Email sent successfully via Mailtrap', [
                'to_email' => $toEmail,
                'subject' => $subject,
                'from_address' => $this->fromAddress,
                'service' => 'mailtrap',
            ]);
        } catch (HttpClientException $e) {
            Log::error('Mailtrap API error', [
                'to_email' => $toEmail,
                'subject' => $subject,
                'error' => $e->getMessage(),
                'service' => 'mailtrap',
            ]);

            throw $e;
        } catch (\Throwable $e) {
            Log::error('Unexpected Mailtrap error', [
                'to_email' => $toEmail,
                'subject' => $subject,
                'error' => $e->getMessage(),
                'service' => 'mailtrap',
            ]);

            throw $e;
        }
    }
}
