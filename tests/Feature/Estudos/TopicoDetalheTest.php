<?php

use App\Models\Concurso;
use App\Models\Disciplina;
use App\Models\Topico;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('topico detalhe page can be rendered', function () {
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

    $response = $this->actingAs($user)->get(route('estudos.topicos', $topico));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Estudos/Topicos/index')
        ->where('topico.id', $topico->id)
        ->where('topico.nome', $topico->nome)
        ->where('topico.disciplina_id', $topico->disciplina_id)
        ->where('topico.concurso_id', $disciplina->concurso_id)
    );
});
