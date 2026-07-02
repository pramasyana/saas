<?php

namespace App\Modules\Pricing\Services;

use App\Modules\Pricing\Contracts\FeatureDefinitionRepositoryInterface;
use App\Modules\Pricing\Contracts\PlanRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use RuntimeException;

class PlanService
{
    public function __construct(
        private readonly PlanRepositoryInterface $planRepository,
        private readonly FeatureDefinitionRepositoryInterface $featureDefinitionRepository,
    ) {}

    public function paginate(array $filters = [], int $perPage = 15): mixed
    {
        return $this->planRepository->paginate($filters, $perPage);
    }

    public function findById(string $id): Plan
    {
        $plan = $this->planRepository->findById($id);
        if (! $plan) {
            throw new RuntimeException('Plan tidak ditemukan.');
        }

        return $plan;
    }

    public function create(array $data): Plan
    {
        return DB::transaction(function () use ($data) {
            $planData = [
                'name' => $data['name'],
                'slug' => $data['slug'] ?? Str::slug($data['name']),
                'description' => $data['description'] ?? null,
                'price_monthly' => $data['price_monthly'] ?? 0,
                'price_yearly' => $data['price_yearly'] ?? null,
                'is_active' => $data['is_active'] ?? true,
                'is_popular' => $data['is_popular'] ?? false,
                'sort_order' => $data['sort_order'] ?? 0,
            ];

            $plan = $this->planRepository->create($planData);

            if (! empty($data['is_popular'])) {
                $this->planRepository->unsetPopularExcept($plan->id);
            }

            if (! empty($data['features'])) {
                $this->planRepository->syncFeatures($plan, $data['features']);
            }

            Log::info('Plan created', [
                'plan_id' => $plan->id,
                'plan_name' => $plan->name,
                'created_by' => auth()->id(),
            ]);

            return $plan->load('features.definition');
        });
    }

    public function update(string $id, array $data): Plan
    {
        return DB::transaction(function () use ($id, $data) {
            $plan = $this->findById($id);

            $planData = [];
            if (isset($data['name'])) {
                $planData['name'] = $data['name'];
            }
            if (isset($data['slug'])) {
                $planData['slug'] = $data['slug'];
            }
            if (isset($data['description'])) {
                $planData['description'] = $data['description'];
            }
            if (isset($data['price_monthly'])) {
                $planData['price_monthly'] = $data['price_monthly'];
            }
            if (array_key_exists('price_yearly', $data)) {
                $planData['price_yearly'] = $data['price_yearly'];
            }
            if (isset($data['is_active'])) {
                $planData['is_active'] = $data['is_active'];
            }
            if (isset($data['is_popular'])) {
                $planData['is_popular'] = $data['is_popular'];
            }
            if (isset($data['sort_order'])) {
                $planData['sort_order'] = $data['sort_order'];
            }

            if (! empty($data['is_popular'])) {
                $this->planRepository->unsetPopularExcept($plan->id);
            }

            $plan = $this->planRepository->update($plan, $planData);

            if (isset($data['features'])) {
                $this->planRepository->syncFeatures($plan, $data['features']);
            }

            Log::info('Plan updated', [
                'plan_id' => $plan->id,
                'plan_name' => $plan->name,
                'updated_by' => auth()->id(),
            ]);

            return $plan->load('features.definition');
        });
    }

    public function togglePopular(string $id): Plan
    {
        return DB::transaction(function () use ($id) {
            $plan = $this->findById($id);

            if ($plan->is_popular) {
                $this->planRepository->update($plan, ['is_popular' => false]);
            } else {
                $this->planRepository->unsetAllPopular();
                $this->planRepository->update($plan, ['is_popular' => true]);
            }

            Log::info('Plan toggled popular', [
                'plan_id' => $plan->id,
                'is_popular' => $plan->fresh()->is_popular,
                'updated_by' => auth()->id(),
            ]);

            return $plan->fresh()->load('features.definition');
        });
    }

    public function delete(string $id): void
    {
        DB::transaction(function () use ($id): void {
            $plan = $this->findById($id);
            $this->planRepository->delete($plan);

            Log::info('Plan deleted', [
                'plan_id' => $id,
                'deleted_by' => auth()->id(),
            ]);
        });
    }

    public function getAllFeatureDefinitions(): mixed
    {
        return $this->featureDefinitionRepository->getAllOrdered();
    }
}
