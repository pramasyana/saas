<?php

declare(strict_types=1);

namespace App\Modules\Crm\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class TagController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('tenant/crm/tags/Index', [
            'title' => 'Tags',
        ]);
    }
}
