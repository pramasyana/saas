<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Modules\Admin\Contracts\UserRepositoryInterface;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
    ) {}

    public function index(): Response
    {
        return Inertia::render('admin/users/index', [
            'title' => 'Manajemen User',
            'stats' => $this->userRepository->getStats(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/users/Create', [
            'title' => 'Tambah User',
        ]);
    }

    public function edit(User $user): Response
    {
        return Inertia::render('admin/users/Edit', [
            'title' => 'Edit User',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_admin' => $user->is_admin,
                'joined_at' => $user->created_at->format('d M Y'),
            ],
        ]);
    }
}
