<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogPageController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/audit-logs/index', [
            'title' => 'Audit Log',
        ]);
    }
}
