<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/users/index', [
            'title' => 'Manajemen User',
            'stats' => [
                'total_users' => User::count(),
                'total_admins' => User::where('is_admin', true)->count(),
                'new_this_month' => User::whereMonth('created_at', now()->month)->count(),
            ],
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
