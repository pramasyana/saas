<?php

namespace App\Modules\Subscription\Services;

use App\Modules\Subscription\Contracts\InvoiceRepositoryInterface;
use App\Modules\Subscription\Models\Invoice;
use App\Modules\Subscription\Models\Subscription;
use Illuminate\Support\Str;

class InvoiceService
{
    public function __construct(
        private readonly InvoiceRepositoryInterface $invoiceRepository,
    ) {}

    public function paginate(array $filters = [], int $perPage = 15): mixed
    {
        return $this->invoiceRepository->paginate($filters, $perPage);
    }

    public function findById(string $id): Invoice
    {
        $invoice = $this->invoiceRepository->findById($id);
        if (! $invoice) {
            throw new \RuntimeException('Invoice tidak ditemukan.');
        }
        return $invoice;
    }

    public function generate(Subscription $subscription): Invoice
    {
        $number = 'INV-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6));

        return $this->invoiceRepository->create([
            'subscription_id' => $subscription->id,
            'number' => $number,
            'amount' => $subscription->price_amount,
            'status' => 'pending',
            'due_date' => now()->addDays(7),
        ]);
    }

    public function markAsPaid(string $id): Invoice
    {
        $invoice = $this->findById($id);
        return $this->invoiceRepository->update($invoice, [
            'status' => 'paid',
            'paid_at' => now(),
        ]);
    }

    public function markAsFailed(string $id, ?string $notes = null): Invoice
    {
        $invoice = $this->findById($id);
        return $this->invoiceRepository->update($invoice, [
            'status' => 'failed',
            'notes' => $notes,
        ]);
    }
}
