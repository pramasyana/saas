<?php

declare(strict_types=1);

namespace App\Modules\Crm\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Crm\Contracts\MembershipTierRepositoryInterface;
use App\Modules\Crm\Http\Requests\StoreMembershipTierRequest;
use App\Modules\Crm\Http\Requests\UpdateMembershipTierRequest;
use App\Modules\Crm\Http\Resources\MembershipTierResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MembershipTierController extends Controller
{
    public function __construct(
        private readonly MembershipTierRepositoryInterface $membershipTierRepository,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $tiers = $this->membershipTierRepository->paginate(
            auth()->user()->tenant_id,
            $request->only(['search', 'is_active']),
            (int) $request->input('per_page', 15),
        );

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => MembershipTierResource::collection($tiers),
            'meta' => [
                'current_page' => $tiers->currentPage(),
                'last_page' => $tiers->lastPage(),
                'per_page' => $tiers->perPage(),
                'total' => $tiers->total(),
            ],
        ]);
    }

    public function store(StoreMembershipTierRequest $request): JsonResponse
    {
        $tier = $this->membershipTierRepository->create(array_merge($request->validated(), [
            'tenant_id' => auth()->user()->tenant_id,
        ]));

        return response()->json([
            'status' => 'success',
            'message' => 'Membership tier berhasil ditambahkan.',
            'data' => new MembershipTierResource($tier),
        ], 201);
    }

    public function update(UpdateMembershipTierRequest $request, string $id): JsonResponse
    {
        $tier = $this->membershipTierRepository->findOrFail($id);
        $tier = $this->membershipTierRepository->update($tier, $request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Membership tier berhasil diupdate.',
            'data' => new MembershipTierResource($tier),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $tier = $this->membershipTierRepository->findOrFail($id);
        $this->membershipTierRepository->delete($tier);

        return response()->json([
            'status' => 'success',
            'message' => 'Membership tier berhasil dihapus.',
        ]);
    }
}
