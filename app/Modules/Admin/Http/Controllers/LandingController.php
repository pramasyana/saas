<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Pricing\Services\PlanService;
use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    public function __construct(
        private readonly PlanService $planService,
    ) {}

    public function index(): Response
    {
        $plans = $this->planService->paginate(['is_active' => '1'], 50);

        return Inertia::render('welcome', [
            'plans' => $plans->map(fn ($plan) => [
                'name' => $plan->name,
                'slug' => $plan->slug,
                'description' => $plan->description,
                'price_monthly' => (float) $plan->price_monthly,
                'price_yearly' => $plan->price_yearly ? (float) $plan->price_yearly : null,
                'is_active' => $plan->is_active,
                'is_popular' => $plan->is_popular,
                'sort_order' => $plan->sort_order,
                'features' => $plan->features->map(fn ($f) => [
                    'id' => $f->id,
                    'value' => $f->value,
                    'definition' => [
                        'key' => $f->definition->key,
                        'label' => $f->definition->label,
                        'type' => $f->definition->type,
                    ],
                ]),
            ]),
        ]);
    }
}
