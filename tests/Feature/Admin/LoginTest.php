<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('admin login page is accessible', function () {
    $response = $this->get(route('admin.login'));

    $response->assertStatus(200);
});

test('admin can login with valid credentials', function () {
    $user = User::factory()->create([
        'email' => 'admin@test.com',
        'password' => bcrypt('password'),
        'is_admin' => true,
    ]);

    $response = $this->post('/admin/login', [
        'email' => 'admin@test.com',
        'password' => 'password',
    ]);

    $response->assertRedirect(route('admin.dashboard'));
    $this->assertAuthenticated();
});

test('admin cannot login with invalid credentials', function () {
    $user = User::factory()->create([
        'email' => 'admin@test.com',
        'password' => bcrypt('password'),
        'is_admin' => true,
    ]);

    $response = $this->post('/admin/login', [
        'email' => 'admin@test.com',
        'password' => 'wrong-password',
    ]);

    $response->assertSessionHasErrors('email');
    $this->assertGuest();
});

test('non-admin user cannot login to admin', function () {
    $user = User::factory()->create([
        'email' => 'user@test.com',
        'password' => bcrypt('password'),
        'is_admin' => false,
    ]);

    $response = $this->post('/admin/login', [
        'email' => 'user@test.com',
        'password' => 'password',
    ]);

    $response->assertSessionHasErrors('email');
    $this->assertGuest();
});

test('admin can logout', function () {
    $user = User::factory()->create([
        'email' => 'admin@test.com',
        'password' => bcrypt('password'),
        'is_admin' => true,
    ]);

    $this->actingAs($user)
        ->post(route('admin.logout'));

    $this->assertGuest();
});

test('guest cannot access admin dashboard', function () {
    $response = $this->get(route('admin.dashboard'));

    $response->assertRedirect(route('admin.login'));
});

test('non-admin user cannot access admin dashboard', function () {
    $user = User::factory()->create([
        'is_admin' => false,
    ]);

    $response = $this->actingAs($user)
        ->get(route('admin.dashboard'));

    $response->assertRedirect(route('admin.login'));
});
