<?php

use App\Models\Concurso;
use App\Models\Disciplina;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('disciplina topicos page can be rendered', function () {
    $user = User::factory()->create();
    $concurso = Concurso::factory()->create(['user_id' => $user->id]);
    $disciplina = Disciplina::factory()->create([
        'user_id' => $user->id,
        'concurso_id' => $concurso->id,
    ]);

    $response = $this->actingAs($user)->get(route('estudos.disciplinas', $disciplina));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Estudos/Disciplinas/index')
        ->where('disciplina.id', $disciplina->id)
        ->where('disciplina.nome', $disciplina->nome)
        ->where('disciplina.concurso_id', $disciplina->concurso_id)
    );
});
