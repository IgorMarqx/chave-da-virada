<?php

use App\Models\Revisao;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('starts a pending review', function () {
    $user = User::factory()->create();
    $revisao = Revisao::factory()->create([
        'user_id' => $user->id,
        'status' => 'pendente',
    ]);

    $response = $this
        ->actingAs($user)
        ->withoutMiddleware('jwt.auth')
        ->postJson("/api/revisoes/{$revisao->id}/iniciar");

    $response->assertSuccessful()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.status', 'em_andamento');

    expect($revisao->refresh()->status)->toBe('em_andamento');
});

it('does not start a completed review', function () {
    $user = User::factory()->create();
    $revisao = Revisao::factory()->create([
        'user_id' => $user->id,
        'status' => 'concluida',
    ]);

    $response = $this
        ->actingAs($user)
        ->withoutMiddleware('jwt.auth')
        ->postJson("/api/revisoes/{$revisao->id}/iniciar");

    $response->assertUnprocessable();

    expect($revisao->refresh()->status)->toBe('concluida');
});
