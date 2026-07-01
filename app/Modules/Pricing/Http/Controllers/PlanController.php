<?php

namespace App\Modules\Pricing\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Pricing\Contracts\FeatureDefinitionRepositoryInterface;
use App\Modules\Pricing\Contracts\PlanRepositoryInterface;
use Inertia\Inertia;
use Inertia\Response;

class PlanController extends Controller
{
    public function __construct(
        private readonly PlanRepositoryInterface $planRepository,
        private readonly FeatureDefinitionRepositoryInterface $featureDefinitionRepository,
    ) {}

    public function index(): Response
    {
        return Inertia::render('admin/pricing/index', [
            'title' => 'Manajemen Pricing',
            'stats' => $this->planRepository->getStats(),
        ]);
    }

    public function create(): Response
    {
        $definitions = $this->featureDefinitionRepository->getAllOrdered();

        return Inertia::render('admin/pricing/Create', [
            'title' => 'Tambah Plan',
            'feature_definitions' => $definitions->map(fn ($d) => [
                'id' => $d->id,
                'key' => $d->key,
                'label' => $d->label,
                'type' => $d->type,
                'default_value' => $d->default_value,
                'category' => $d->category,
            ]),
        ]);
    }

    public function edit(string $id): Response
    {
        $plan = $this->planRepository->findById($id);
        abort_unless((bool) $plan, 404);

        $definitions = $this->featureDefinitionRepository->getAllOrdered();

        return Inertia::render('admin/pricing/Edit', [
            'title' => 'Edit Plan',
            'plan' => [
                'id' => $plan->id,
                'name' => $plan->name,
                'slug' => $plan->slug,
                'description' => $plan->description,
                'price_monthly' => (float) $plan->price_monthly,
                'price_yearly' => $plan->price_yearly ? (float) $plan->price_yearly : null,
                'is_active' => $plan->is_active,
                'is_popular' => $plan->is_popular,
                'sort_order' => $plan->sort_order,
                'features' => $plan->features->map(fn ($f) => [
                    'feature_definition_id' => $f->feature_definition_id,
                    'value' => $f->value,
                ]),
            ],
            'feature_definitions' => $definitions->map(fn ($d) => [
                'id' => $d->id,
                'key' => $d->key,
                'label' => $d->label,
                'type' => $d->type,
                'default_value' => $d->default_value,
                'category' => $d->category,
            ]),
        ]);
    }
}
