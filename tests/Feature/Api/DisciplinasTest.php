<?php

use App\Models\Concurso;
use App\Models\Disciplina;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('updates a disciplina', function () {
    $user = User::factory()->create();
    $concurso = Concurso::factory()->create(['user_id' => $user->id]);
    $disciplina = Disciplina::factory()->create([
        'user_id' => $user->id,
        'concurso_id' => $concurso->id,
    ]);

    $response = $this
        ->actingAs($user)
        ->withoutMiddleware('jwt.auth')
        ->patchJson("/api/disciplinas/{$disciplina->id}", [
            'nome' => 'Disciplina Atualizada',
        ]);

    $response->assertSuccessful()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.nome', 'Disciplina Atualizada');

    $this->assertDatabaseHas('disciplinas', [
        'id' => $disciplina->id,
        'nome' => 'Disciplina Atualizada',
    ]);
});

it('forbids updating another users disciplina', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $disciplina = Disciplina::factory()->create(['user_id' => $user->id]);

    $response = $this
        ->actingAs($otherUser)
        ->withoutMiddleware('jwt.auth')
        ->patchJson("/api/disciplinas/{$disciplina->id}", [
            'nome' => 'Tentativa',
        ]);

    $response->assertForbidden();
});

it('deletes a disciplina', function () {
    $user = User::factory()->create();
    $disciplina = Disciplina::factory()->create(['user_id' => $user->id]);

    $response = $this
        ->actingAs($user)
        ->withoutMiddleware('jwt.auth')
        ->deleteJson("/api/disciplinas/{$disciplina->id}");

    $response->assertSuccessful()
        ->assertJsonPath('success', true);

    $this->assertDatabaseMissing('disciplinas', [
        'id' => $disciplina->id,
    ]);
});

it('returns not found when deleting another users disciplina', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $disciplina = Disciplina::factory()->create(['user_id' => $user->id]);

    $response = $this
        ->actingAs($otherUser)
        ->withoutMiddleware('jwt.auth')
        ->deleteJson("/api/disciplinas/{$disciplina->id}");

    $response->assertNotFound();
});
