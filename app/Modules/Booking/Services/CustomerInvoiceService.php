<?php

declare(strict_types=1);

namespace App\Modules\Booking\Services;

use App\Modules\Booking\Contracts\CustomerInvoiceRepositoryInterface;
use App\Modules\Booking\Models\Booking;
use App\Modules\Booking\Models\CustomerInvoice;
use Illuminate\Support\Facades\DB;

class CustomerInvoiceService
{
    public function __construct(
        private readonly CustomerInvoiceRepositoryInterface $repository,
    ) {}

    public function paginate(array $filters = [], int $perPage = 15)
    {
        return $this->repository->paginate($filters, $perPage);
    }

    public function findById(string $id): CustomerInvoice
    {
        $invoice = $this->repository->findById($id);

        if (! $invoice) {
            throw new \RuntimeException('Invoice tidak ditemukan.');
        }

        return $invoice;
    }

    public function generateFromBooking(Booking $booking): ?CustomerInvoice
    {
        $tenantId = tenant()->getTenantKey();
        $services = $booking->services()->with('addons')->get();

        if ($services->isEmpty()) {
            return null;
        }

        $existing = CustomerInvoice::where('tenant_id', $tenantId)
            ->where('booking_id', $booking->id)
            ->first();

        if ($existing) {
            return null;
        }

        $items = [];
        $subtotal = 0;

        foreach ($services as $service) {
            $lineTotal = (float) $service->price * (int) $service->quantity;
            $items[] = [
                'type' => 'service',
                'name' => $service->name,
                'quantity' => (int) $service->quantity,
                'unit_price' => (float) $service->price,
                'total_price' => $lineTotal,
                'metadata' => [
                    'staff_name' => $service->staff?->name,
                    'duration' => $service->duration,
                ],
            ];
            $subtotal += $lineTotal;

            foreach ($service->addons as $addon) {
                $addonTotal = (float) $addon->price * (int) $addon->quantity;
                $items[] = [
                    'type' => 'addon',
                    'name' => $addon->name,
                    'quantity' => (int) $addon->quantity,
                    'unit_price' => (float) $addon->price,
                    'total_price' => $addonTotal,
                    'metadata' => null,
                ];
                $subtotal += $addonTotal;
            }
        }

        $taxRate = $this->getTaxRate($tenantId);
        $discountAmount = 0;
        $taxAmount = round(($subtotal - $discountAmount) * $taxRate / 100, 2);
        $totalAmount = $subtotal - $discountAmount + $taxAmount;

        $invoice = null;

        DB::transaction(function () use (
            $tenantId, $booking, $items, $subtotal, $taxRate, $taxAmount, $discountAmount, $totalAmount, &$invoice
        ) {
            $invoice = $this->repository->create([
                'tenant_id' => $tenantId,
                'booking_id' => $booking->id,
                'customer_id' => $booking->customer_id,
                'subtotal' => $subtotal,
                'tax_rate' => $taxRate,
                'tax_amount' => $taxAmount,
                'discount_amount' => $discountAmount,
                'total_amount' => $totalAmount,
                'status' => 'pending',
                'due_date' => now()->addDays(7),
            ]);

            foreach ($items as $item) {
                $invoice->items()->create($item);
            }
        });

        return $invoice?->fresh(['customer', 'items']);
    }

    public function markAsPaid(string $id, string $paymentMethod, float $amount): CustomerInvoice
    {
        $invoice = $this->findById($id);

        $newPaidAmount = (float) $invoice->paid_amount + $amount;
        $totalAmount = (float) $invoice->total_amount;

        if ($newPaidAmount >= $totalAmount) {
            $status = 'paid';
            $paidAmount = $totalAmount;
        } else {
            $status = 'partial';
            $paidAmount = $newPaidAmount;
        }

        return $this->repository->update($invoice, [
            'status' => $status,
            'payment_method' => $paymentMethod,
            'paid_amount' => $paidAmount,
            'paid_at' => now(),
        ]);
    }

    public function updateNotes(string $id, ?string $notes): CustomerInvoice
    {
        $invoice = $this->findById($id);

        return $this->repository->update($invoice, ['notes' => $notes]);
    }

    public function getStats(): array
    {
        return $this->repository->getStats(tenant()->getTenantKey());
    }

    private function getTaxRate(string $tenantId): float
    {
        $config = tenant()->getInternal('invoice_config') ?? [];

        return (float) ($config['tax_rate'] ?? 0);
    }
}
