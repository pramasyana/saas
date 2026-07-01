<?php

declare(strict_types=1);

namespace App\Modules\Company\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Modules\Company\Http\Requests\StoreHolidayRequest;
use App\Modules\Company\Http\Requests\UpdateHolidayRequest;
use App\Modules\Company\Services\CompanyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HolidayController extends Controller
{
    public function __construct(
        private readonly CompanyService $companyService,
    ) {}

    public function index(Request $request): Response|JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;

        $filters = $request->only(['search', 'branch_id', 'year', 'upcoming', 'sort', 'direction', 'per_page']);
        $holidays = $this->companyService->getHolidays($tenantId, $filters);

        if ($request->wantsJson()) {
            return response()->json([
                'data' => $holidays->items(),
                'meta' => [
                    'current_page' => $holidays->currentPage(),
                    'last_page' => $holidays->lastPage(),
                    'per_page' => $holidays->perPage(),
                    'total' => $holidays->total(),
                ],
            ]);
        }

        return Inertia::render('tenant/company/Holidays', [
            'holidays' => $holidays,
        ]);
    }

    public function store(StoreHolidayRequest $request): RedirectResponse|JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;

        $holiday = $this->companyService->createHoliday($tenantId, $request->validated());

        if ($request->wantsJson()) {
            return response()->json(['status' => 'success', 'message' => 'Hari libur berhasil ditambahkan.', 'data' => $holiday], 201);
        }

        return redirect()->back()->with('success', 'Hari libur berhasil ditambahkan.');
    }

    public function update(string $id, UpdateHolidayRequest $request): RedirectResponse|JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;

        $holiday = $this->companyService->updateHoliday($tenantId, $id, $request->validated());

        if ($request->wantsJson()) {
            return response()->json(['status' => 'success', 'message' => 'Hari libur berhasil diperbarui.', 'data' => $holiday]);
        }

        return redirect()->back()->with('success', 'Hari libur berhasil diperbarui.');
    }

    public function destroy(string $id, Request $request): RedirectResponse|JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;

        $this->companyService->deleteHoliday($tenantId, $id);

        if ($request->wantsJson()) {
            return response()->json(['status' => 'success', 'message' => 'Hari libur berhasil dihapus.']);
        }

        return redirect()->back()->with('success', 'Hari libur berhasil dihapus.');
    }
}
