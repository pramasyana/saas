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
            ->component('admin/users')
            ->has('title')
        );
});
