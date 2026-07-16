<?php

declare(strict_types=1);

namespace App\Modules\Financing\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FinancingController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('tenant/financing/Index', [
            'title' => 'Financing',
        ]);
    }

    public function costs(Request $request): Response
    {
        return Inertia::render('tenant/financing/costs/Index', [
            'title' => 'Biaya',
        ]);
    }

    public function categories(Request $request): Response
    {
        return Inertia::render('tenant/financing/categories/Index', [
            'title' => 'Kategori Biaya',
        ]);
    }
}
