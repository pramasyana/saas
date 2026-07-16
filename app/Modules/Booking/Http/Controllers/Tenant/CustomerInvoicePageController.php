<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerInvoicePageController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('tenant/invoice/Index', [
            'title' => 'Invoice',
        ]);
    }

    public function show(Request $request, string $id): Response
    {
        return Inertia::render('tenant/invoice/Show', [
            'title' => 'Detail Invoice',
            'invoiceId' => $id,
        ]);
    }
}
