<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class TenantNotificationPageController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/tenant-notifications/index', [
            'title' => 'Notifikasi Tenant',
        ]);
    }
}
