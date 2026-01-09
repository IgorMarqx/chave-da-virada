<?php

use App\Models\Concurso;
use App\Models\Disciplina;
use App\Models\Topico;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('revisao topico page can be rendered with revisao breadcrumbs', function () {
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

    $response = $this->actingAs($user)->get(route('estudos.revisao.topico', $topico));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Estudos/Topicos/review')
        ->where('topico.id', $topico->id)
        ->where('breadcrumbs.0.title', 'Revisao')
        ->where('breadcrumbs.0.href', '/revisao')
        ->where('breadcrumbs.1.title', $topico->nome)
        ->where('breadcrumbs.1.href', "/revisao/{$topico->id}")
        ->where('backHref', '/revisao')
    );
});
