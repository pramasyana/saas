<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Controllers\Api\Tenant;

use App\Modules\Booking\Http\Resources\CustomerInvoiceResource;
use App\Modules\Booking\Services\CustomerInvoicePdfService;
use App\Modules\Booking\Services\CustomerInvoiceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CustomerInvoiceController
{
    public function __construct(
        private readonly CustomerInvoiceService $service,
        private readonly CustomerInvoicePdfService $pdfService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['status', 'customer_id', 'search', 'sort', 'direction', 'per_page']);
        $perPage = (int) $request->input('per_page', 15);

        $paginator = $this->service->paginate($filters, $perPage);

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => CustomerInvoiceResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $invoice = $this->service->findById($id);

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => new CustomerInvoiceResource($invoice),
        ]);
    }

    public function stats(): JsonResponse
    {
        $stats = $this->service->getStats();

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => $stats,
        ]);
    }

    public function pay(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'payment_method' => 'required|string|in:cash,card,transfer,e-wallet,other',
            'amount' => 'required|numeric|min:0',
        ]);

        $invoice = $this->service->markAsPaid($id, $validated['payment_method'], (float) $validated['amount']);

        return response()->json([
            'status' => 'success',
            'message' => 'Pembayaran berhasil dicatat.',
            'data' => new CustomerInvoiceResource($invoice),
        ]);
    }

    public function updateNotes(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'notes' => 'nullable|string|max:1000',
        ]);

        $invoice = $this->service->updateNotes($id, $validated['notes'] ?? null);

        return response()->json([
            'status' => 'success',
            'message' => 'Catatan berhasil diperbarui.',
            'data' => new CustomerInvoiceResource($invoice),
        ]);
    }

    public function downloadPdf(string $id): Response
    {
        $invoice = $this->service->findById($id);

        return $this->pdfService->download($invoice);
    }

    public function previewPdf(string $id): Response
    {
        $invoice = $this->service->findById($id);

        return $this->pdfService->stream($invoice);
    }
}
