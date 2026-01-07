<?php

use App\Models\Concurso;
use App\Models\Disciplina;
use App\Models\Topico;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('updates a topico', function () {
    $user = User::factory()->create();
    $concurso = Concurso::factory()->create(['user_id' => $user->id]);
    $disciplina = Disciplina::factory()->create([
        'user_id' => $user->id,
        'concurso_id' => $concurso->id,
    ]);
    $topico = Topico::factory()->create([
        'user_id' => $user->id,
        'disciplina_id' => $disciplina->id,
    ]);

    $response = $this
        ->actingAs($user)
        ->withoutMiddleware('jwt.auth')
        ->patchJson("/api/topicos/{$topico->id}", [
            'nome' => 'Topico Atualizado',
            'descricao' => 'Descricao atualizada',
        ]);

    $response->assertSuccessful()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.nome', 'Topico Atualizado');

    $this->assertDatabaseHas('topicos', [
        'id' => $topico->id,
        'nome' => 'Topico Atualizado',
    ]);
});

it('forbids updating another users topico', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $topico = Topico::factory()->create(['user_id' => $user->id]);

    $response = $this
        ->actingAs($otherUser)
        ->withoutMiddleware('jwt.auth')
        ->patchJson("/api/topicos/{$topico->id}", [
            'nome' => 'Tentativa',
        ]);

    $response->assertForbidden();
});

it('deletes a topico', function () {
    $user = User::factory()->create();
    $topico = Topico::factory()->create(['user_id' => $user->id]);

    $response = $this
        ->actingAs($user)
        ->withoutMiddleware('jwt.auth')
        ->deleteJson("/api/topicos/{$topico->id}");

    $response->assertSuccessful()
        ->assertJsonPath('success', true);

    $this->assertDatabaseMissing('topicos', [
        'id' => $topico->id,
    ]);
});

it('returns not found when deleting another users topico', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $topico = Topico::factory()->create(['user_id' => $user->id]);

    $response = $this
        ->actingAs($otherUser)
        ->withoutMiddleware('jwt.auth')
        ->deleteJson("/api/topicos/{$topico->id}");

    $response->assertNotFound();
});
