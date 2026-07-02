<?php

declare(strict_types=1);

namespace App\Modules\Crm\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Crm\Http\Requests\StoreCustomerNoteRequest;
use App\Modules\Crm\Http\Requests\UpdateCustomerNoteRequest;
use App\Modules\Crm\Http\Resources\CustomerNoteResource;
use App\Modules\Crm\Services\CustomerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    public function __construct(
        private readonly CustomerService $customerService,
    ) {}

    public function index(Request $request, string $customerId): JsonResponse
    {
        $notes = $this->customerService->paginateNotes(
            $customerId,
            $request->only(['search']),
            (int) $request->input('per_page', 15),
        );

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => CustomerNoteResource::collection($notes),
            'meta' => [
                'current_page' => $notes->currentPage(),
                'last_page' => $notes->lastPage(),
                'per_page' => $notes->perPage(),
                'total' => $notes->total(),
            ],
        ]);
    }

    public function store(StoreCustomerNoteRequest $request): JsonResponse
    {
        $note = $this->customerService->createNote($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Catatan berhasil ditambahkan.',
            'data' => new CustomerNoteResource($note->load('user')),
        ], 201);
    }

    public function update(UpdateCustomerNoteRequest $request, string $id): JsonResponse
    {
        $note = $this->customerService->updateNote($id, $request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Catatan berhasil diupdate.',
            'data' => new CustomerNoteResource($note),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $this->customerService->deleteNote($id);

        return response()->json([
            'status' => 'success',
            'message' => 'Catatan berhasil dihapus.',
        ]);
    }
}
