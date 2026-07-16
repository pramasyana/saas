<?php

declare(strict_types=1);

namespace App\Modules\Staff\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ShiftController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('tenant/staff/shift/index', [
            'title' => 'Shift Assignment',
        ]);
    }
}
