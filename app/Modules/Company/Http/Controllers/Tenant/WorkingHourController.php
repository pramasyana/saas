<?php

declare(strict_types=1);

namespace App\Modules\Company\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class WorkingHourController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('tenant/company/WorkingHours', [
            'title' => 'Jam Kerja',
        ]);
    }
}
