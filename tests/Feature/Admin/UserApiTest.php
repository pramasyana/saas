<?php

use App\Models\User;
use App\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;

uses(RefreshDatabase::class);

test('admin can list users via API', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    User::factory()->count(3)->create();

    $response = $this->actingAs($admin)
        ->getJson('/api/v1/admin/users');

    $response->assertOk()
        ->assertJsonStructure([
            'status',
            'data' => [
                '*' => ['id', 'name', 'email', 'is_admin', 'created_at', 'joined_at'],
            ],
            'meta' => ['current_page', 'last_page', 'per_page', 'total'],
        ])
        ->assertJsonCount(4, 'data');
});

test('admin can search users via API', function () {
    $admin = User::factory()->create(['is_admin' => true, 'name' => 'Admin User']);
    User::factory()->create(['name' => 'John Doe']);
    User::factory()->create(['name' => 'Jane Smith']);

    $response = $this->actingAs($admin)
        ->getJson('/api/v1/admin/users?search=John');

    $response->assertOk()
        ->assertJsonCount(1, 'data');
});

test('admin can filter admin users via API', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    User::factory()->count(3)->create(['is_admin' => false]);

    $response = $this->actingAs($admin)
        ->getJson('/api/v1/admin/users?is_admin=1');

    $response->assertOk()
        ->assertJsonCount(1, 'data');
});

test('admin can create user via API', function () {
    Notification::fake();

    $admin = User::factory()->create(['is_admin' => true]);

    $response = $this->actingAs($admin)
        ->postJson('/api/v1/admin/users', [
            'name' => 'New User',
            'email' => 'new@test.com',
            'password' => 'Admin123!',
            'password_confirmation' => 'Admin123!',
        ]);

    $response->assertCreated()
        ->assertJsonPath('data.name', 'New User');
    $this->assertDatabaseHas('users', ['email' => 'new@test.com']);

    $user = User::where('email', 'new@test.com')->first();
    expect($user->email_verified_at)->toBeNull();

    Notification::assertSentTo($user, VerifyEmail::class);
});

test('admin can update user via API', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $user = User::factory()->create(['name' => 'Old Name']);

    $response = $this->actingAs($admin)
        ->putJson("/api/v1/admin/users/{$user->id}", [
            'name' => 'Updated Name',
        ]);

    $response->assertOk()
        ->assertJsonPath('data.name', 'Updated Name');
});

test('admin can delete user via API', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $user = User::factory()->create();

    $response = $this->actingAs($admin)
        ->deleteJson("/api/v1/admin/users/{$user->id}");

    $response->assertOk();
    $this->assertDatabaseMissing('users', ['id' => $user->id]);
});

test('admin cannot delete own account via API', function () {
    $admin = User::factory()->create(['is_admin' => true]);

    $response = $this->actingAs($admin)
        ->deleteJson("/api/v1/admin/users/{$admin->id}");

    $response->assertStatus(422)
        ->assertJsonPath('message', 'Tidak dapat menghapus akun sendiri.');
    $this->assertDatabaseHas('users', ['id' => $admin->id]);
});

test('non-admin cannot access users API', function () {
    $user = User::factory()->create(['is_admin' => false]);

    $response = $this->actingAs($user)
        ->getJson('/api/v1/admin/users');

    $response->assertForbidden();
});

test('password must meet complexity requirements', function () {
    $admin = User::factory()->create(['is_admin' => true]);

    $response = $this->actingAs($admin)
        ->postJson('/api/v1/admin/users', [
            'name' => 'Weak Password',
            'email' => 'weak@test.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['password']);
});

test('password confirmation mismatch is rejected', function () {
    $admin = User::factory()->create(['is_admin' => true]);

    $response = $this->actingAs($admin)
        ->postJson('/api/v1/admin/users', [
            'name' => 'Mismatch User',
            'email' => 'mismatch@test.com',
            'password' => 'Admin123!',
            'password_confirmation' => 'Admin456@',
        ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['password']);
});

test('update password with confirmation works', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $user = User::factory()->create();

    $response = $this->actingAs($admin)
        ->putJson("/api/v1/admin/users/{$user->id}", [
            'password' => 'NewPass123!',
            'password_confirmation' => 'NewPass123!',
        ]);

    $response->assertOk();
});

test('guest cannot access users API', function () {
    $response = $this->getJson('/api/v1/admin/users');

    $response->assertUnauthorized();
});
