<?php

namespace App\Modules\Admin\Services;

use App\Models\Tenant;
use App\Modules\Subscription\Models\Invoice;
use App\Modules\Subscription\Models\Subscription;
use Illuminate\Support\Facades\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportService
{
    public function exportTenants(array $filters = []): StreamedResponse
    {
        $query = Tenant::with(['user', 'domains', 'subscriptions.plan'])->withCount('users');

        if (! empty($filters['status'])) {
            if ($filters['status'] === 'active') {
                $query->whereHas('subscriptions', fn ($q) => $q->where('status', 'active'));
            } elseif ($filters['status'] === 'inactive') {
                $query->whereDoesntHave('subscriptions', fn ($q) => $q->where('status', 'active'));
            }
        }

        $tenants = $query->get();

        $headers = [['Nama Tenant', 'Email', 'Domain', 'Pemilik', 'Plan', 'Status Subs', 'Total User', 'Tanggal Bergabung']];

        $rows = $tenants->map(fn (Tenant $t) => [
            $t->getInternal('name') ?? '',
            $t->getInternal('email') ?? '',
            $t->domains->first()?->domain ?? '',
            $t->user?->name ?? '',
            $t->subscriptions->first()?->plan?->name ?? '',
            $t->subscriptions->first()?->status ?? '',
            (string) $t->users_count,
            $t->created_at?->format('Y-m-d') ?? '',
        ]);

        return $this->streamCsv('tenants-'.now()->format('Ymd').'.csv', $headers, $rows);
    }

    public function exportSubscriptions(array $filters = []): StreamedResponse
    {
        $query = Subscription::with(['user', 'plan', 'tenant']);

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        $subscriptions = $query->get();

        $headers = [['Tenant', 'Pelanggan', 'Plan', 'Harga', 'Interval', 'Status', 'Mulai', 'Akhir']];

        $rows = $subscriptions->map(fn (Subscription $s) => [
            $s->tenant->getInternal('name') ?? '',
            $s->user?->name ?? '',
            $s->plan?->name ?? '',
            (string) $s->price_amount,
            $s->billing_interval,
            $s->status,
            $s->starts_at?->format('Y-m-d') ?? '',
            $s->ends_at?->format('Y-m-d') ?? '',
        ]);

        return $this->streamCsv('subscriptions-'.now()->format('Ymd').'.csv', $headers, $rows);
    }

    public function exportInvoices(array $filters = []): StreamedResponse
    {
        $query = Invoice::with(['subscription.user', 'subscription.plan', 'subscription.tenant']);

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        $invoices = $query->get();

        $headers = [['No. Invoice', 'Tenant', 'Pelanggan', 'Plan', 'Jumlah', 'Status', 'Jatuh Tempo', 'Dibayar']];

        $rows = $invoices->map(fn (Invoice $inv) => [
            $inv->number,
            $inv->subscription->tenant->getInternal('name') ?? '',
            $inv->subscription->user?->name ?? '',
            $inv->subscription->plan?->name ?? '',
            (string) $inv->amount,
            $inv->status,
            $inv->due_date?->format('Y-m-d') ?? '',
            $inv->paid_at?->format('Y-m-d') ?? '',
        ]);

        return $this->streamCsv('invoices-'.now()->format('Ymd').'.csv', $headers, $rows);
    }

    private function streamCsv(string $filename, array $headers, iterable $rows): StreamedResponse
    {
        return Response::stream(function () use ($headers, $rows) {
            $output = fopen('php://output', 'w');
            fwrite($output, "\xEF\xBB\xBF");

            foreach ($headers as $header) {
                fputcsv($output, $header);
            }

            foreach ($rows as $row) {
                fputcsv($output, $row);
            }

            fclose($output);
        }, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
        ]);
    }
}
