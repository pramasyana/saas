<?php

namespace App\Modules\Pricing\Contracts;

use App\Modules\Pricing\Models\FeatureDefinition;
use Illuminate\Support\Collection;

interface FeatureDefinitionRepositoryInterface
{
    public function getAll(): Collection;

    public function findById(string $id): ?FeatureDefinition;

    public function create(array $data): FeatureDefinition;

    public function update(FeatureDefinition $definition, array $data): FeatureDefinition;

    public function delete(FeatureDefinition $definition): bool;
}
