<?php

namespace App\Modules\Pricing\Services;

use App\Modules\Pricing\Contracts\FeatureDefinitionRepositoryInterface;
use App\Modules\Pricing\Models\FeatureDefinition;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class FeatureDefinitionService
{
    public function __construct(
        private readonly FeatureDefinitionRepositoryInterface $repository,
    ) {}

    public function getAll(): mixed
    {
        return $this->repository->getAll();
    }

    public function findById(string $id): FeatureDefinition
    {
        $definition = $this->repository->findById($id);
        if (! $definition) {
            throw new RuntimeException('Feature definition tidak ditemukan.');
        }
        return $definition;
    }

    public function create(array $data): FeatureDefinition
    {
        return DB::transaction(function () use ($data) {
            $definition = $this->repository->create($data);

            Log::info('Feature definition created', [
                'definition_id' => $definition->id,
                'key' => $definition->key,
                'created_by' => auth()->id(),
            ]);

            return $definition;
        });
    }

    public function update(string $id, array $data): FeatureDefinition
    {
        return DB::transaction(function () use ($id, $data) {
            $definition = $this->findById($id);
            $definition = $this->repository->update($definition, $data);

            Log::info('Feature definition updated', [
                'definition_id' => $definition->id,
                'key' => $definition->key,
                'updated_by' => auth()->id(),
            ]);

            return $definition;
        });
    }

    public function delete(string $id): void
    {
        DB::transaction(function () use ($id): void {
            $definition = $this->findById($id);
            $this->repository->delete($definition);

            Log::info('Feature definition deleted', [
                'definition_id' => $id,
                'deleted_by' => auth()->id(),
            ]);
        });
    }
}
