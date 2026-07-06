<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Admin\Services\ExportService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportController extends Controller
{
    public function __construct(
        private readonly ExportService $exportService,
    ) {}

    public function tenants(Request $request): StreamedResponse
    {
        return $this->exportService->exportTenants($request->only(['status']));
    }

    public function subscriptions(Request $request): StreamedResponse
    {
        return $this->exportService->exportSubscriptions($request->only(['status']));
    }

    public function invoices(Request $request): StreamedResponse
    {
        return $this->exportService->exportInvoices($request->only(['status']));
    }
}
