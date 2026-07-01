<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Notification\Contracts\EmailLogRepositoryInterface;
use Inertia\Inertia;
use Inertia\Response;

class EmailLogController extends Controller
{
    public function __construct(
        private readonly EmailLogRepositoryInterface $emailLogRepository,
    ) {}

    public function index(): Response
    {
        return Inertia::render('admin/email-logs/index', [
            'title' => 'Email Logs',
            'stats' => $this->emailLogRepository->getStats(),
        ]);
    }
}
