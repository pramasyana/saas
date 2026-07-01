<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('admin users page renders via inertia', function () {
    $admin = User::factory()->create(['is_admin' => true]);

    $response = $this->actingAs($admin)
        ->get(route('admin.users'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/users/index')
            ->has('title')
        );
});

test('admin users create page renders via inertia', function () {
    $admin = User::factory()->create(['is_admin' => true]);

    $response = $this->actingAs($admin)
        ->get(route('admin.users.create'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/users/Create')
            ->has('title')
        );
});

test('admin users edit page renders via inertia', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $user = User::factory()->create();

    $response = $this->actingAs($admin)
        ->get(route('admin.users.edit', $user->id));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/users/Edit')
            ->has('title')
            ->has('user')
        );
});
