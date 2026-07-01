<?php

namespace App\Modules\Subscription\Contracts;

use App\Modules\Subscription\Models\Invoice;
use Illuminate\Pagination\LengthAwarePaginator;

interface InvoiceRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findById(string $id): ?Invoice;

    public function create(array $data): Invoice;

    public function update(Invoice $invoice, array $data): Invoice;
}
