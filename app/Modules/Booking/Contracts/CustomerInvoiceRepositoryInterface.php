<?php

declare(strict_types=1);

namespace App\Modules\Booking\Contracts;

use App\Modules\Booking\Models\CustomerInvoice;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface CustomerInvoiceRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findById(string $id): ?CustomerInvoice;

    public function create(array $data): CustomerInvoice;

    public function update(CustomerInvoice $invoice, array $data): CustomerInvoice;

    public function getStats(string $tenantId): array;
}
