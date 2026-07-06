<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class SystemPageController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/system/index', [
            'title' => 'System Health',
        ]);
    }
}
