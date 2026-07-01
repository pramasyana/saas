<?php

namespace App\Modules\Auth\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Auth\Actions\RegisterTenantAction;
use App\Modules\Auth\Http\Requests\RegisterRequest;
use App\Modules\Auth\Http\Resources\RegisterResource;
use Illuminate\Http\JsonResponse;

class RegisterController extends Controller
{
    public function store(RegisterRequest $request, RegisterTenantAction $action): JsonResponse
    {
        $user = $action->execute($request);

        return response()->json([
            'status' => 'success',
            'message' => 'Registrasi berhasil. Silakan cek email untuk verifikasi.',
            'data' => [
                'user' => new RegisterResource($user),
            ],
        ], 201);
    }
}
