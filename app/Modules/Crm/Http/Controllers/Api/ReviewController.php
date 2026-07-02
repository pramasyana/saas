<?php

declare(strict_types=1);

namespace App\Modules\Crm\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Crm\Contracts\ReviewRepositoryInterface;
use App\Modules\Crm\Http\Requests\StoreReviewRequest;
use App\Modules\Crm\Http\Requests\UpdateReviewRequest;
use App\Modules\Crm\Http\Resources\ReviewResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function __construct(
        private readonly ReviewRepositoryInterface $reviewRepository,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $reviews = $this->reviewRepository->paginate(
            auth()->user()->tenant_id,
            $request->only(['is_approved', 'customer_id', 'reviewable_type', 'rating']),
            (int) $request->input('per_page', 15),
        );

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => ReviewResource::collection($reviews),
            'meta' => [
                'current_page' => $reviews->currentPage(),
                'last_page' => $reviews->lastPage(),
                'per_page' => $reviews->perPage(),
                'total' => $reviews->total(),
            ],
        ]);
    }

    public function store(StoreReviewRequest $request): JsonResponse
    {
        $review = $this->reviewRepository->create(array_merge($request->validated(), [
            'tenant_id' => auth()->user()->tenant_id,
            'staff_id' => auth()->id(),
            'is_approved' => false,
        ]));

        return response()->json([
            'status' => 'success',
            'message' => 'Review berhasil ditambahkan.',
            'data' => new ReviewResource($review->load('customer')),
        ], 201);
    }

    public function update(UpdateReviewRequest $request, string $id): JsonResponse
    {
        $review = $this->reviewRepository->findOrFail($id);
        $review = $this->reviewRepository->update($review, $request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Review berhasil diupdate.',
            'data' => new ReviewResource($review),
        ]);
    }

    public function approve(string $id): JsonResponse
    {
        $review = $this->reviewRepository->findOrFail($id);
        $review = $this->reviewRepository->update($review, ['is_approved' => true]);

        return response()->json([
            'status' => 'success',
            'message' => 'Review berhasil disetujui.',
            'data' => new ReviewResource($review),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $review = $this->reviewRepository->findOrFail($id);
        $this->reviewRepository->delete($review);

        return response()->json([
            'status' => 'success',
            'message' => 'Review berhasil dihapus.',
        ]);
    }
}
