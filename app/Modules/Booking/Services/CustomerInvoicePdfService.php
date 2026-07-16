<?php

declare(strict_types=1);

namespace App\Modules\Booking\Services;

use App\Modules\Booking\Models\CustomerInvoice;
use Barryvdh\DomPDF\Facade\Pdf;

class CustomerInvoicePdfService
{
    public function generate(CustomerInvoice $invoice): \Barryvdh\DomPDF\PDF
    {
        $invoice->load(['customer', 'items', 'booking.branch']);

        $pdf = Pdf::loadView('invoices.customer', [
            'invoice' => $invoice,
            'tenant' => tenant(),
        ]);

        $pdf->setPaper('a4');
        $pdf->option('isHtml5ParserEnabled', true);
        $pdf->option('isRemoteEnabled', true);

        return $pdf;
    }

    public function stream(CustomerInvoice $invoice): \Symfony\Component\HttpFoundation\Response
    {
        return $this->generate($invoice)
            ->stream("invoice-{$invoice->number}.pdf");
    }

    public function download(CustomerInvoice $invoice): \Symfony\Component\HttpFoundation\Response
    {
        return $this->generate($invoice)
            ->download("invoice-{$invoice->number}.pdf");
    }
}
