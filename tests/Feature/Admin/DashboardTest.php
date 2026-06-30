<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('admin can view dashboard', function () {
    $user = User::factory()->create([
        'is_admin' => true,
    ]);

    $response = $this->actingAs($user)
        ->get(route('admin.dashboard'));

    $response->assertStatus(200);
});

test('dashboard shows admin user info', function () {
    $user = User::factory()->create([
        'name' => 'Admin User',
        'email' => 'admin@test.com',
        'is_admin' => true,
    ]);

    $response = $this->actingAs($user)
        ->get(route('admin.dashboard'));

    $response->assertInertia(fn ($page) => $page
        ->component('admin/dashboard')
        ->has('stats')
        ->has('recent_users')
        ->has('weekly_signups')
    );
});

test('dashboard shows correct stats', function () {
    $admin = User::factory()->create([
        'is_admin' => true,
    ]);

    User::factory()->count(5)->create([
        'is_admin' => false,
    ]);

    $response = $this->actingAs($admin)
        ->get(route('admin.dashboard'));

    $response->assertInertia(fn ($page) => $page
        ->where('stats.total_users', 6)
        ->where('stats.total_admins', 1)
    );
});
