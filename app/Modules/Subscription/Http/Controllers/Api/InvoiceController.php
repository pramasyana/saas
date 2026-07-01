<?php

namespace App\Modules\Subscription\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Subscription\Http\Resources\InvoiceResource;
use App\Modules\Subscription\Services\InvoiceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function __construct(
        private readonly InvoiceService $invoiceService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $invoices = $this->invoiceService->paginate(
            $request->only(['status', 'subscription_id', 'sort', 'direction']),
            (int) $request->input('per_page', 15),
        );

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => InvoiceResource::collection($invoices),
            'meta' => [
                'current_page' => $invoices->currentPage(),
                'last_page' => $invoices->lastPage(),
                'per_page' => $invoices->perPage(),
                'total' => $invoices->total(),
            ],
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $invoice = $this->invoiceService->findById($id);

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => new InvoiceResource($invoice),
        ]);
    }
}
