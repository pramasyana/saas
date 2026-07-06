<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ActivityPageController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/activity/index', [
            'title' => 'Aktivitas Tenant',
        ]);
    }
}
