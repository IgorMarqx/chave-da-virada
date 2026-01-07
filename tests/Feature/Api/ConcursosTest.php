<?php

use App\Models\Concurso;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('updates a concurso', function () {
    $user = User::factory()->create();
    $concurso = Concurso::factory()->create(['user_id' => $user->id]);

    $response = $this
        ->actingAs($user)
        ->withoutMiddleware('jwt.auth')
        ->patchJson("/api/concursos/{$concurso->id}", [
            'nome' => 'Concurso Atualizado',
            'orgao' => 'TRF 1',
            'data_prova' => '2030-03-01',
            'descricao' => 'Descricao atualizada',
        ]);

    $response->assertSuccessful()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.nome', 'Concurso Atualizado');

    $this->assertDatabaseHas('concursos', [
        'id' => $concurso->id,
        'nome' => 'Concurso Atualizado',
    ]);
});

it('forbids updating another users concurso', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $concurso = Concurso::factory()->create(['user_id' => $user->id]);

    $response = $this
        ->actingAs($otherUser)
        ->withoutMiddleware('jwt.auth')
        ->patchJson("/api/concursos/{$concurso->id}", [
            'nome' => 'Tentativa',
            'orgao' => 'TRF 2',
        ]);

    $response->assertForbidden();
});

it('deletes a concurso', function () {
    $user = User::factory()->create();
    $concurso = Concurso::factory()->create(['user_id' => $user->id]);

    $response = $this
        ->actingAs($user)
        ->withoutMiddleware('jwt.auth')
        ->deleteJson("/api/concursos/{$concurso->id}");

    $response->assertSuccessful()
        ->assertJsonPath('success', true);

    $this->assertDatabaseMissing('concursos', [
        'id' => $concurso->id,
    ]);
});

it('returns not found when deleting another users concurso', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $concurso = Concurso::factory()->create(['user_id' => $user->id]);

    $response = $this
        ->actingAs($otherUser)
        ->withoutMiddleware('jwt.auth')
        ->deleteJson("/api/concursos/{$concurso->id}");

    $response->assertNotFound();
});
