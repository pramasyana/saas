<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Booking\Http\Requests\StoreWaitingListRequest;
use App\Modules\Booking\Http\Requests\UpdateWaitingListRequest;
use App\Modules\Booking\Http\Resources\WaitingListResource;
use App\Modules\Booking\Services\WaitingListService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WaitingListController extends Controller
{
    public function __construct(
        private readonly WaitingListService $waitingListService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $waitingList = $this->waitingListService->paginate(
            $request->only(['search', 'status', 'date']),
            (int) $request->input('per_page', 15),
        );

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => WaitingListResource::collection($waitingList),
            'meta' => [
                'current_page' => $waitingList->currentPage(),
                'last_page' => $waitingList->lastPage(),
                'per_page' => $waitingList->perPage(),
                'total' => $waitingList->total(),
            ],
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $waitingList = $this->waitingListService->findById($id);

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => new WaitingListResource($waitingList),
        ]);
    }

    public function store(StoreWaitingListRequest $request): JsonResponse
    {
        $waitingList = $this->waitingListService->create($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Berhasil ditambahkan ke waiting list.',
            'data' => new WaitingListResource($waitingList),
        ], 201);
    }

    public function update(UpdateWaitingListRequest $request, string $id): JsonResponse
    {
        $waitingList = $this->waitingListService->update($id, $request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Waiting list berhasil diupdate.',
            'data' => new WaitingListResource($waitingList),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $this->waitingListService->delete($id);

        return response()->json([
            'status' => 'success',
            'message' => 'Waiting list berhasil dihapus.',
        ]);
    }

    public function notify(string $id): JsonResponse
    {
        $waitingList = $this->waitingListService->notify($id);

        return response()->json([
            'status' => 'success',
            'message' => 'Notifikasi telah dikirim.',
            'data' => new WaitingListResource($waitingList),
        ]);
    }
}
