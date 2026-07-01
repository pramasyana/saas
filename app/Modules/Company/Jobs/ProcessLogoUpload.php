<?php

declare(strict_types=1);

namespace App\Modules\Company\Jobs;

use App\Modules\Company\Contracts\CompanyBrandingRepositoryInterface;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProcessLogoUpload implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        private readonly string $tenantId,
        private readonly string $filePath,
    ) {}

    public function handle(CompanyBrandingRepositoryInterface $brandingRepository): void
    {
        try {
            $fullPath = Storage::disk('public')->path($this->filePath);

            if (! file_exists($fullPath)) {
                Log::warning('Logo file not found for processing', [
                    'tenant_id' => $this->tenantId,
                    'path' => $this->filePath,
                ]);

                return;
            }

            $imageInfo = getimagesize($fullPath);
            if ($imageInfo === false) {
                return;
            }

            [$width, $height] = $imageInfo;

            $maxSize = 200;
            if ($width > $maxSize || $height > $maxSize) {
                $ratio = min($maxSize / $width, $maxSize / $height);
                $newWidth = (int) round($width * $ratio);
                $newHeight = (int) round($height * $ratio);

                $srcImage = match ($imageInfo[2]) {
                    IMAGETYPE_JPEG => imagecreatefromjpeg($fullPath),
                    IMAGETYPE_PNG => imagecreatefrompng($fullPath),
                    IMAGETYPE_WEBP => imagecreatefromwebp($fullPath),
                    default => null,
                };

                if ($srcImage !== null) {
                    $resizedImage = imagescale($srcImage, $newWidth, $newHeight);
                    if ($resizedImage !== false) {
                        imagepng($resizedImage, $fullPath);
                        imagedestroy($resizedImage);
                    }
                    imagedestroy($srcImage);
                }
            }

            Log::info('Logo processed successfully', [
                'tenant_id' => $this->tenantId,
                'path' => $this->filePath,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to process logo upload', [
                'tenant_id' => $this->tenantId,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
