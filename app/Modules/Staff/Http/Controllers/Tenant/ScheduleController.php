<?php

declare(strict_types=1);

namespace App\Modules\Staff\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ScheduleController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('tenant/staff/schedule/index', [
            'title' => 'Jadwal Staff',
        ]);
    }
}
