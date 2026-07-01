<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Notification\Models\EmailLog;
use Inertia\Inertia;
use Inertia\Response;

class EmailLogController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/email-logs/index', [
            'title' => 'Email Logs',
            'stats' => [
                'total_sent' => EmailLog::where('status', 'sent')->count(),
                'total_failed' => EmailLog::where('status', 'failed')->count(),
                'total_logs' => EmailLog::count(),
            ],
        ]);
    }
}
