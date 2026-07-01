<?php

namespace App\Modules\Subscription\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Subscription\Contracts\SubscriptionRepositoryInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionController extends Controller
{
    public function __construct(
        private readonly SubscriptionRepositoryInterface $subscriptionRepository,
    ) {}

    public function index(Request $request): Response
    {
        return Inertia::render('admin/subscriptions/index', [
            'title' => 'Subscriptions',
            'stats' => $this->subscriptionRepository->getStats(),
        ]);
    }
}
