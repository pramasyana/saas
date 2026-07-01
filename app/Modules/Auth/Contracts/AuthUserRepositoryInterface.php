<?php

declare(strict_types=1);

namespace App\Modules\Auth\Contracts;

use App\Models\User;

interface AuthUserRepositoryInterface
{
    public function findById(int $id): ?User;

    public function findByEmail(string $email): ?User;

    public function create(array $data): User;
}
