<?php

declare(strict_types=1);

namespace App\Modules\Crm\Repositories;

use App\Modules\Crm\Contracts\ReviewRepositoryInterface;
use App\Modules\Crm\Models\Review;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ReviewRepository implements ReviewRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Review::where('tenant_id', $tenantId);

        if (! empty($filters['customer_id'])) {
            $query->where('customer_id', $filters['customer_id']);
        }

        if (! empty($filters['rating'])) {
            $query->where('rating', $filters['rating']);
        }

        if (isset($filters['is_approved'])) {
            $query->where('is_approved', filter_var($filters['is_approved'], FILTER_VALIDATE_BOOLEAN));
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function findAllByTenant(string $tenantId): Collection
    {
        return Review::where('tenant_id', $tenantId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function findById(string $id): ?Review
    {
        return Review::find($id);
    }

    public function findOrFail(string $id): Review
    {
        return Review::findOrFail($id);
    }

    public function create(array $data): Review
    {
        return Review::create($data);
    }

    public function update(Review $review, array $data): Review
    {
        $review->update($data);

        return $review;
    }

    public function delete(Review $review): bool
    {
        return $review->delete();
    }

    public function findByCustomer(string $customerId): Collection
    {
        return Review::where('customer_id', $customerId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function findByReviewable(string $reviewableType, string $reviewableId): Collection
    {
        return Review::where('reviewable_type', $reviewableType)
            ->where('reviewable_id', $reviewableId)
            ->where('is_approved', true)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function findPendingApproval(string $tenantId): Collection
    {
        return Review::where('tenant_id', $tenantId)
            ->where('is_approved', false)
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
