<?php

declare(strict_types=1);

namespace App\Modules\Crm\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Crm\Http\Requests\UpdateMembershipRequest;
use App\Modules\Crm\Http\Resources\MembershipResource;
use App\Modules\Crm\Services\CustomerService;
use Illuminate\Http\JsonResponse;

class MembershipController extends Controller
{
    public function __construct(
        private readonly CustomerService $customerService,
    ) {}

    public function show(string $customerId): JsonResponse
    {
        $membership = $this->customerService->getMembership($customerId);

        if (! $membership) {
            return response()->json([
                'status' => 'success',
                'message' => 'Customer belum memiliki membership.',
                'data' => null,
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => new MembershipResource($membership->load('tier')),
        ]);
    }

    public function update(UpdateMembershipRequest $request, string $customerId): JsonResponse
    {
        $membership = $this->customerService->updateMembership($customerId, $request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Membership berhasil diupdate.',
            'data' => new MembershipResource($membership->load('tier')),
        ]);
    }
}
