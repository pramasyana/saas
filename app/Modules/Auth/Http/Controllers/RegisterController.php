<?php

namespace App\Modules\Auth\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Auth\Actions\RegisterTenantAction;
use App\Modules\Auth\Http\Requests\RegisterRequest;
use App\Modules\Pricing\Contracts\PlanRepositoryInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RegisterController extends Controller
{
    public function __construct(
        private readonly PlanRepositoryInterface $planRepository,
    ) {}

    public function create(Request $request): Response
    {
        $plans = $this->planRepository->getAllActive();

        $defaultSlug = $request->query('plan', 'free');
        $defaultBilling = $request->query('billing', 'monthly');
        if (! in_array($defaultBilling, ['monthly', 'yearly'])) {
            $defaultBilling = 'monthly';
        }

        return Inertia::render('auth/register', [
            'plans' => $plans->map(fn ($plan) => [
                'id' => $plan->id,
                'name' => $plan->name,
                'slug' => $plan->slug,
                'description' => $plan->description,
                'price_monthly' => (float) $plan->price_monthly,
                'price_yearly' => $plan->price_yearly ? (float) $plan->price_yearly : null,
                'is_popular' => $plan->is_popular,
                'sort_order' => $plan->sort_order,
                'features' => $plan->features->map(fn ($f) => [
                    'id' => $f->id,
                    'value' => $f->value,
                    'definition' => [
                        'key' => $f->definition->key,
                        'label' => $f->definition->label,
                        'type' => $f->definition->type,
                        'category' => $f->definition->category,
                    ],
                ]),
            ])->values(),
            'defaultPlan' => $defaultSlug,
            'defaultBilling' => $defaultBilling,
        ]);
    }

    public function store(RegisterRequest $request, RegisterTenantAction $action): RedirectResponse
    {
        $action->execute($request);

        return redirect()->route('verification.notice');
    }
}
