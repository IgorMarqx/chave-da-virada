<?php

use App\Models\Concurso;
use App\Models\Disciplina;
use App\Models\Revisao;
use App\Models\RevisaoConfiguracao;
use App\Models\Topico;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('excludes topics with pending reviews on review day', function () {
    $user = User::factory()->create();
    $now = CarbonImmutable::now('America/Fortaleza');

    RevisaoConfiguracao::factory()->create([
        'user_id' => $user->id,
        'ativo' => true,
        'modo' => 'semanal',
        'dia_revisao' => $now->dayOfWeek,
        'timezone' => 'America/Fortaleza',
    ]);

    $concurso = Concurso::factory()->create(['user_id' => $user->id]);
    $disciplina = Disciplina::factory()->create([
        'user_id' => $user->id,
        'concurso_id' => $concurso->id,
    ]);

    $topicoRevisao = Topico::factory()->create([
        'user_id' => $user->id,
        'disciplina_id' => $disciplina->id,
    ]);
    $topicoNormal = Topico::factory()->create([
        'user_id' => $user->id,
        'disciplina_id' => $disciplina->id,
    ]);

    Revisao::factory()->create([
        'user_id' => $user->id,
        'topico_id' => $topicoRevisao->id,
        'data_revisao' => $now->startOfDay(),
        'status' => 'pendente',
        'tipo' => 'semanal',
    ]);

    $response = $this
        ->actingAs($user)
        ->withoutMiddleware('jwt.auth')
        ->getJson("/api/estudos/topicos?disciplina_id={$disciplina->id}");

    $response->assertSuccessful()
        ->assertJsonPath('success', true);

    $topicoIds = collect($response->json('data'))->pluck('id')->all();

    expect($topicoIds)->toContain($topicoNormal->id)
        ->not->toContain($topicoRevisao->id);
});
