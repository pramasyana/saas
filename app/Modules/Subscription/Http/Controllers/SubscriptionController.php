<?php

namespace App\Modules\Subscription\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Subscription\Models\Subscription;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('admin/subscriptions/index', [
            'title' => 'Subscriptions',
            'stats' => [
                'active' => Subscription::where('status', 'active')->count(),
                'cancelled' => Subscription::where('status', 'cancelled')->count(),
                'total_revenue' => (float) Subscription::where('status', 'active')->sum('price_amount'),
            ],
        ]);
    }
}
