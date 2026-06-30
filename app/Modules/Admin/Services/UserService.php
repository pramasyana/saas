<?php

namespace App\Modules\Admin\Services;

use App\Models\User;
use App\Modules\Admin\Contracts\UserRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UserService
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
    ) {}

    /** @param array<string, mixed> $filters */
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->userRepository->paginate($filters, $perPage);
    }

    public function findById(int $id): User
    {
        return $this->userRepository->findById($id) ?? throw new \RuntimeException('User not found.');
    }

    public function create(array $data): User
    {
        return DB::transaction(function () use ($data) {
            $data['password'] = bcrypt($data['password']);

            $user = $this->userRepository->create($data);

            Log::info('User created', [
                'user_id' => $user->id,
                'created_by' => auth()->id(),
            ]);

            return $user;
        });
    }

    public function update(int $id, array $data): User
    {
        return DB::transaction(function () use ($id, $data) {
            $user = $this->findById($id);

            if (! empty($data['password'])) {
                $data['password'] = bcrypt($data['password']);
            } else {
                unset($data['password']);
            }

            $user = $this->userRepository->update($user, $data);

            Log::info('User updated', [
                'user_id' => $user->id,
                'updated_by' => auth()->id(),
            ]);

            return $user;
        });
    }

    public function delete(int $id): void
    {
        if ($id === (int) auth()->id()) {
            throw new \RuntimeException('Tidak dapat menghapus akun sendiri.');
        }

        DB::transaction(function () use ($id): void {
            $user = $this->findById($id);

            $this->userRepository->delete($user);

            Log::info('User deleted', [
                'user_id' => $id,
                'deleted_by' => auth()->id(),
            ]);
        });
    }
}
