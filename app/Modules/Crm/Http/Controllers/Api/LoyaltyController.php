<?php

declare(strict_types=1);

namespace App\Modules\Crm\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Crm\Http\Requests\StoreLoyaltyTransactionRequest;
use App\Modules\Crm\Http\Resources\LoyaltyTransactionResource;
use App\Modules\Crm\Services\LoyaltyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LoyaltyController extends Controller
{
    public function __construct(
        private readonly LoyaltyService $loyaltyService,
    ) {}

    public function balance(string $customerId): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => $this->loyaltyService->getBalance($customerId),
        ]);
    }

    public function transactions(Request $request, string $customerId): JsonResponse
    {
        $transactions = $this->loyaltyService->getTransactions(
            $customerId,
            $request->only(['type']),
            (int) $request->input('per_page', 15),
        );

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => LoyaltyTransactionResource::collection($transactions),
            'meta' => [
                'current_page' => $transactions->currentPage(),
                'last_page' => $transactions->lastPage(),
                'per_page' => $transactions->perPage(),
                'total' => $transactions->total(),
            ],
        ]);
    }

    public function earn(StoreLoyaltyTransactionRequest $request, string $customerId): JsonResponse
    {
        $transaction = $this->loyaltyService->earnPoints(array_merge($request->validated(), [
            'customer_id' => $customerId,
        ]));

        return response()->json([
            'status' => 'success',
            'message' => 'Poin berhasil ditambahkan.',
            'data' => new LoyaltyTransactionResource($transaction),
        ], 201);
    }

    public function spend(StoreLoyaltyTransactionRequest $request, string $customerId): JsonResponse
    {
        $transaction = $this->loyaltyService->spendPoints(array_merge($request->validated(), [
            'customer_id' => $customerId,
        ]));

        return response()->json([
            'status' => 'success',
            'message' => 'Poin berhasil digunakan.',
            'data' => new LoyaltyTransactionResource($transaction),
        ], 201);
    }
}
