<?php

declare(strict_types=1);

namespace App\Modules\Setting\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('tenant/settings/Index', [
            'title' => 'Pengaturan',
        ]);
    }
}
