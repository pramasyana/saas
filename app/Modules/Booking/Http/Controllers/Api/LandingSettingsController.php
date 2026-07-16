<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Controllers\Api;

use App\Modules\Booking\Http\Requests\UpdateLandingSettingsRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class LandingSettingsController
{
    public function index(): JsonResponse
    {
        $tenant = tenant();
        $config = $tenant->getInternal('landing_config') ?? [];

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => $config,
        ]);
    }

    public function update(UpdateLandingSettingsRequest $request): JsonResponse
    {
        $tenant = tenant();
        $validated = $request->validated();

        $config = $validated;

        $tenant->setInternal('landing_config', $config);
        $tenant->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Pengaturan landing page berhasil disimpan.',
            'data' => $config,
        ]);
    }

    public function uploadLogo(Request $request): JsonResponse
    {
        $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,webp|max:2048',
        ]);

        $tenant = tenant();
        $tenantId = $tenant->getTenantKey();

        /** @var UploadedFile $file */
        $file = $request->file('logo');

        $path = $file->storeAs(
            "landing/{$tenantId}",
            'logo.'.$file->getClientOriginalExtension(),
            'public',
        );

        $url = Storage::url($path);

        $config = $tenant->getInternal('landing_config') ?? [];
        $config['logo'] = $url;
        $tenant->setInternal('landing_config', $config);
        $tenant->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Logo berhasil diupload.',
            'data' => ['logo' => $url],
        ]);
    }

    public function deleteLogo(): JsonResponse
    {
        $tenant = tenant();
        $config = $tenant->getInternal('landing_config') ?? [];

        if (! empty($config['logo'])) {
            $path = parse_url($config['logo'], PHP_URL_PATH);
            $relativePath = ltrim(str_replace('/storage/', '', $path), '/');
            Storage::disk('public')->delete($relativePath);
        }

        $config['logo'] = null;
        $tenant->setInternal('landing_config', $config);
        $tenant->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Logo berhasil dihapus.',
            'data' => ['logo' => null],
        ]);
    }

    public function uploadImage(Request $request): JsonResponse
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,webp|max:3072',
            'section' => 'required|string|in:hero,about,gallery,logo_cloud,hero_background,hero_carousel,hero_image',
        ]);

        $tenant = tenant();
        $tenantId = $tenant->getTenantKey();

        /** @var UploadedFile $file */
        $file = $request->file('image');

        $section = $request->input('section');
        $ext = $file->getClientOriginalExtension();

        $filename = $section.'_'.uniqid().'.'.$ext;

        $path = $file->storeAs(
            "landing/{$tenantId}",
            $filename,
            'public',
        );

        $url = Storage::url($path);

        return response()->json([
            'status' => 'success',
            'message' => 'Gambar berhasil diupload.',
            'data' => ['url' => $url],
        ]);
    }
}
