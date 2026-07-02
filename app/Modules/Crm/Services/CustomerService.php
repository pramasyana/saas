<?php

declare(strict_types=1);

namespace App\Modules\Crm\Services;

use App\Modules\Crm\Contracts\CustomerNoteRepositoryInterface;
use App\Modules\Crm\Contracts\CustomerRepositoryInterface;
use App\Modules\Crm\Contracts\MembershipRepositoryInterface;
use App\Modules\Crm\Contracts\TimelineEventRepositoryInterface;
use App\Modules\Crm\Models\Customer;
use App\Modules\Crm\Models\CustomerNote;
use App\Modules\Crm\Models\Membership;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class CustomerService
{
    public function __construct(
        private readonly CustomerRepositoryInterface $customerRepository,
        private readonly CustomerNoteRepositoryInterface $customerNoteRepository,
        private readonly TimelineEventRepositoryInterface $timelineEventRepository,
        private readonly MembershipRepositoryInterface $membershipRepository,
    ) {}

    public function getTenantId(): string
    {
        return auth()->user()->tenant_id;
    }

    // ── Customer CRUD ──

    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->customerRepository->paginate($this->getTenantId(), $filters, $perPage);
    }

    public function findOrFail(string $id): Customer
    {
        return $this->customerRepository->findOrFail($id);
    }

    public function create(array $data): Customer
    {
        return DB::transaction(function () use ($data) {
            return $this->customerRepository->create(array_merge($data, [
                'tenant_id' => $this->getTenantId(),
            ]));
        });
    }

    public function update(string $id, array $data): Customer
    {
        return DB::transaction(function () use ($id, $data) {
            $customer = $this->customerRepository->findOrFail($id);

            return $this->customerRepository->update($customer, $data);
        });
    }

    public function delete(string $id): void
    {
        DB::transaction(function () use ($id) {
            $customer = $this->customerRepository->findOrFail($id);
            $this->customerRepository->delete($customer);
        });
    }

    public function getStats(): array
    {
        $tenantId = $this->getTenantId();

        return [
            'total' => $this->customerRepository->countByTenant($tenantId),
            'active' => $this->customerRepository->countActiveByTenant($tenantId),
            'with_membership' => $this->customerRepository->countWithMembershipByTenant($tenantId),
        ];
    }

    // ── Tags ──

    public function syncTags(string $id, array $tagIds): Customer
    {
        return DB::transaction(function () use ($id, $tagIds) {
            $customer = $this->customerRepository->findOrFail($id);
            $customer->tags()->sync($tagIds);

            return $customer;
        });
    }

    // ── Notes ──

    public function paginateNotes(string $customerId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $filters['customer_id'] = $customerId;

        return $this->customerNoteRepository->paginate($this->getTenantId(), $filters, $perPage);
    }

    public function createNote(array $data): CustomerNote
    {
        return DB::transaction(function () use ($data) {
            return $this->customerNoteRepository->create(array_merge($data, [
                'tenant_id' => $this->getTenantId(),
                'user_id' => auth()->id(),
            ]));
        });
    }

    public function updateNote(string $id, array $data): CustomerNote
    {
        return DB::transaction(function () use ($id, $data) {
            $note = $this->customerNoteRepository->findOrFail($id);

            return $this->customerNoteRepository->update($note, $data);
        });
    }

    public function deleteNote(string $id): void
    {
        DB::transaction(function () use ($id) {
            $note = $this->customerNoteRepository->findOrFail($id);
            $this->customerNoteRepository->delete($note);
        });
    }

    // ── Timeline ──

    public function paginateTimeline(string $customerId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $filters['customer_id'] = $customerId;

        return $this->timelineEventRepository->paginate($this->getTenantId(), $filters, $perPage);
    }

    // ── Membership ──

    public function getMembership(string $customerId): ?Membership
    {
        return $this->membershipRepository->findByCustomer($customerId);
    }

    public function updateMembership(string $customerId, array $data): Membership
    {
        return DB::transaction(function () use ($customerId, $data) {
            $membership = $this->membershipRepository->findByCustomer($customerId);

            if ($membership) {
                return $this->membershipRepository->update($membership, $data);
            }

            return $this->membershipRepository->create(array_merge($data, [
                'tenant_id' => $this->getTenantId(),
                'customer_id' => $customerId,
            ]));
        });
    }
}
