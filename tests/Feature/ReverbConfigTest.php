<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('returns reverb config for authenticated users', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->withoutMiddleware('jwt.auth')
        ->getJson('/api/reverb-config');

    $response->assertSuccessful()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.key', config('broadcasting.connections.reverb.key'))
        ->assertJsonPath('data.host', config('broadcasting.connections.reverb.options.host'));
});
