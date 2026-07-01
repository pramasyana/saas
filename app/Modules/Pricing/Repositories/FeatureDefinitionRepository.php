<?php

namespace App\Modules\Pricing\Repositories;

use App\Modules\Pricing\Contracts\FeatureDefinitionRepositoryInterface;
use App\Modules\Pricing\Models\FeatureDefinition;
use Illuminate\Support\Collection;

class FeatureDefinitionRepository implements FeatureDefinitionRepositoryInterface
{
    public function getAll(): Collection
    {
        return FeatureDefinition::orderBy('sort_order')->get();
    }

    public function findById(string $id): ?FeatureDefinition
    {
        return FeatureDefinition::find($id);
    }

    public function create(array $data): FeatureDefinition
    {
        return FeatureDefinition::create($data);
    }

    public function update(FeatureDefinition $definition, array $data): FeatureDefinition
    {
        $definition->update($data);
        return $definition;
    }

    public function delete(FeatureDefinition $definition): bool
    {
        return $definition->delete();
    }
}
