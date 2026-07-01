<?php

declare(strict_types=1);

namespace App\Modules\Company\Actions;

use App\Modules\Company\Contracts\CompanyBrandingRepositoryInterface;
use App\Modules\Company\Events\CompanyBrandingUpdated;
use App\Modules\Company\Models\CompanyBranding;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class UpdateCompanyBrandingAction
{
    public function __construct(
        private readonly CompanyBrandingRepositoryInterface $companyBrandingRepository,
    ) {}

    public function execute(string $tenantId, array $data): CompanyBranding
    {
        if (isset($data['favicon']) && $data['favicon'] instanceof UploadedFile) {
            $data['favicon_path'] = $this->processFavicon($tenantId, $data['favicon']);
        }
        unset($data['favicon']);

        $branding = $this->companyBrandingRepository->updateOrCreate($tenantId, $data);

        CompanyBrandingUpdated::dispatch($tenantId, $branding);

        return $branding;
    }

    private function processFavicon(string $tenantId, UploadedFile $favicon): string
    {
        $path = $favicon->storeAs(
            "company/{$tenantId}",
            'favicon.'.$favicon->getClientOriginalExtension(),
            'public',
        );

        return Storage::url($path);
    }
}
