<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/settings', [
            'title' => 'Pengaturan',
            'phpVersion' => PHP_VERSION,
            'appVersion' => config('app.version', '1.0.0'),
            'laravelVersion' => app()->version(),
        ]);
    }
}
