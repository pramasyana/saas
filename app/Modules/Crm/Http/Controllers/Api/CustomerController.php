<?php

declare(strict_types=1);

namespace App\Modules\Crm\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Crm\Http\Requests\StoreCustomerRequest;
use App\Modules\Crm\Http\Requests\UpdateCustomerRequest;
use App\Modules\Crm\Http\Resources\CustomerResource;
use App\Modules\Crm\Http\Resources\TagResource;
use App\Modules\Crm\Services\CustomerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function __construct(
        private readonly CustomerService $customerService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $customers = $this->customerService->paginate(
            $request->only(['search', 'is_active', 'tag_id']),
            (int) $request->input('per_page', 15),
        );

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => CustomerResource::collection($customers),
            'meta' => [
                'current_page' => $customers->currentPage(),
                'last_page' => $customers->lastPage(),
                'per_page' => $customers->perPage(),
                'total' => $customers->total(),
            ],
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $customer = $this->customerService->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => new CustomerResource($customer->load(['tags', 'membership.tier'])),
        ]);
    }

    public function store(StoreCustomerRequest $request): JsonResponse
    {
        $customer = $this->customerService->create($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Customer berhasil ditambahkan.',
            'data' => new CustomerResource($customer),
        ], 201);
    }

    public function update(UpdateCustomerRequest $request, string $id): JsonResponse
    {
        $customer = $this->customerService->update($id, $request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Customer berhasil diupdate.',
            'data' => new CustomerResource($customer),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $this->customerService->delete($id);

        return response()->json([
            'status' => 'success',
            'message' => 'Customer berhasil dihapus.',
        ]);
    }

    public function stats(): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => $this->customerService->getStats(),
        ]);
    }

    public function tags(Request $request, string $id): JsonResponse
    {
        $customer = $this->customerService->syncTags($id, $request->input('tag_ids', []));

        return response()->json([
            'status' => 'success',
            'message' => 'Tags berhasil disimpan.',
            'data' => TagResource::collection($customer->tags),
        ]);
    }
}
