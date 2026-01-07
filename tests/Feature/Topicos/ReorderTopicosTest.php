<?php

use App\Models\Concurso;
use App\Models\Disciplina;
use App\Models\Topico;
use App\Models\User;

test('reorders topicos for a disciplina', function () {
    $user = User::factory()->create();
    $concurso = Concurso::factory()->create(['user_id' => $user->id]);
    $disciplina = Disciplina::factory()->create([
        'user_id' => $user->id,
        'concurso_id' => $concurso->id,
    ]);

    $topicoA = Topico::factory()->create([
        'user_id' => $user->id,
        'disciplina_id' => $disciplina->id,
        'ordem' => 1,
    ]);
    $topicoB = Topico::factory()->create([
        'user_id' => $user->id,
        'disciplina_id' => $disciplina->id,
        'ordem' => 2,
    ]);
    $topicoC = Topico::factory()->create([
        'user_id' => $user->id,
        'disciplina_id' => $disciplina->id,
        'ordem' => 3,
    ]);

    $this->actingAs($user)->withoutMiddleware('jwt.auth');

    $response = $this->patchJson('/api/topicos/ordem', [
        'disciplina_id' => $disciplina->id,
        'topicos' => [$topicoC->id, $topicoA->id, $topicoB->id],
    ]);

    $response->assertSuccessful();

    $orderedIds = Topico::query()
        ->where('disciplina_id', $disciplina->id)
        ->orderBy('ordem')
        ->pluck('id')
        ->all();

    expect($orderedIds)->toBe([$topicoC->id, $topicoA->id, $topicoB->id]);
});

test('rejects topicos that do not belong to the disciplina', function () {
    $user = User::factory()->create();
    $concurso = Concurso::factory()->create(['user_id' => $user->id]);
    $disciplina = Disciplina::factory()->create([
        'user_id' => $user->id,
        'concurso_id' => $concurso->id,
    ]);

    $topico = Topico::factory()->create([
        'user_id' => $user->id,
        'disciplina_id' => $disciplina->id,
        'ordem' => 1,
    ]);

    $otherUser = User::factory()->create();
    $otherConcurso = Concurso::factory()->create(['user_id' => $otherUser->id]);
    $otherDisciplina = Disciplina::factory()->create([
        'user_id' => $otherUser->id,
        'concurso_id' => $otherConcurso->id,
    ]);
    $otherTopico = Topico::factory()->create([
        'user_id' => $otherUser->id,
        'disciplina_id' => $otherDisciplina->id,
        'ordem' => 1,
    ]);

    $this->actingAs($user)->withoutMiddleware('jwt.auth');

    $response = $this->patchJson('/api/topicos/ordem', [
        'disciplina_id' => $disciplina->id,
        'topicos' => [$topico->id, $otherTopico->id],
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['topicos']);
});
