<?php

declare(strict_types=1);

namespace App\Modules\Crm\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Crm\Contracts\RewardRepositoryInterface;
use App\Modules\Crm\Http\Requests\RewardRedemptionRequest;
use App\Modules\Crm\Http\Requests\StoreRewardRequest;
use App\Modules\Crm\Http\Requests\UpdateRewardRequest;
use App\Modules\Crm\Http\Resources\RewardRedemptionResource;
use App\Modules\Crm\Http\Resources\RewardResource;
use App\Modules\Crm\Services\LoyaltyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RewardController extends Controller
{
    public function __construct(
        private readonly RewardRepositoryInterface $rewardRepository,
        private readonly LoyaltyService $loyaltyService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $rewards = $this->rewardRepository->paginate(
            auth()->user()->tenant_id,
            $request->only(['search', 'is_active']),
            (int) $request->input('per_page', 15),
        );

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => RewardResource::collection($rewards),
            'meta' => [
                'current_page' => $rewards->currentPage(),
                'last_page' => $rewards->lastPage(),
                'per_page' => $rewards->perPage(),
                'total' => $rewards->total(),
            ],
        ]);
    }

    public function store(StoreRewardRequest $request): JsonResponse
    {
        $reward = $this->rewardRepository->create(array_merge($request->validated(), [
            'tenant_id' => auth()->user()->tenant_id,
        ]));

        return response()->json([
            'status' => 'success',
            'message' => 'Reward berhasil ditambahkan.',
            'data' => new RewardResource($reward),
        ], 201);
    }

    public function update(UpdateRewardRequest $request, string $id): JsonResponse
    {
        $reward = $this->rewardRepository->findOrFail($id);
        $reward = $this->rewardRepository->update($reward, $request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Reward berhasil diupdate.',
            'data' => new RewardResource($reward),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $reward = $this->rewardRepository->findOrFail($id);
        $this->rewardRepository->delete($reward);

        return response()->json([
            'status' => 'success',
            'message' => 'Reward berhasil dihapus.',
        ]);
    }

    public function redeem(RewardRedemptionRequest $request): JsonResponse
    {
        $redemption = $this->loyaltyService->redeemReward($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Reward berhasil ditukarkan.',
            'data' => new RewardRedemptionResource($redemption->load('reward')),
        ], 201);
    }
}
