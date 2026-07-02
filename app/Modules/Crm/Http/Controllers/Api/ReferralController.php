<?php

declare(strict_types=1);

namespace App\Modules\Crm\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Crm\Http\Requests\StoreReferralRequest;
use App\Modules\Crm\Http\Resources\ReferralResource;
use App\Modules\Crm\Services\ReferralService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReferralController extends Controller
{
    public function __construct(
        private readonly ReferralService $referralService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $referrals = $this->referralService->paginate(
            $request->only(['referrer_customer_id', 'status']),
            (int) $request->input('per_page', 15),
        );

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => ReferralResource::collection($referrals),
            'meta' => [
                'current_page' => $referrals->currentPage(),
                'last_page' => $referrals->lastPage(),
                'per_page' => $referrals->perPage(),
                'total' => $referrals->total(),
            ],
        ]);
    }

    public function store(StoreReferralRequest $request): JsonResponse
    {
        $referral = $this->referralService->create($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Referral berhasil dibuat.',
            'data' => new ReferralResource($referral),
        ], 201);
    }

    public function convert(string $id): JsonResponse
    {
        $referral = $this->referralService->convert($id);

        return response()->json([
            'status' => 'success',
            'message' => 'Referral berhasil dikonversi.',
            'data' => new ReferralResource($referral),
        ]);
    }

    public function markRewardGiven(string $id): JsonResponse
    {
        $referral = $this->referralService->markRewardGiven($id);

        return response()->json([
            'status' => 'success',
            'message' => 'Reward referral berhasil diberikan.',
            'data' => new ReferralResource($referral),
        ]);
    }
}
