<?php

declare(strict_types=1);

namespace App\Modules\Crm\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Crm\Contracts\TagRepositoryInterface;
use App\Modules\Crm\Http\Requests\StoreTagRequest;
use App\Modules\Crm\Http\Requests\UpdateTagRequest;
use App\Modules\Crm\Http\Resources\TagResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TagController extends Controller
{
    public function __construct(
        private readonly TagRepositoryInterface $tagRepository,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $tags = $this->tagRepository->paginate(
            auth()->user()->tenant_id,
            $request->only(['search', 'is_active']),
            (int) $request->input('per_page', 15),
        );

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => TagResource::collection($tags),
            'meta' => [
                'current_page' => $tags->currentPage(),
                'last_page' => $tags->lastPage(),
                'per_page' => $tags->perPage(),
                'total' => $tags->total(),
            ],
        ]);
    }

    public function store(StoreTagRequest $request): JsonResponse
    {
        $tag = $this->tagRepository->create(array_merge($request->validated(), [
            'tenant_id' => auth()->user()->tenant_id,
        ]));

        return response()->json([
            'status' => 'success',
            'message' => 'Tag berhasil ditambahkan.',
            'data' => new TagResource($tag),
        ], 201);
    }

    public function update(UpdateTagRequest $request, string $id): JsonResponse
    {
        $tag = $this->tagRepository->findOrFail($id);
        $tag = $this->tagRepository->update($tag, $request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Tag berhasil diupdate.',
            'data' => new TagResource($tag),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $tag = $this->tagRepository->findOrFail($id);
        $this->tagRepository->delete($tag);

        return response()->json([
            'status' => 'success',
            'message' => 'Tag berhasil dihapus.',
        ]);
    }
}
