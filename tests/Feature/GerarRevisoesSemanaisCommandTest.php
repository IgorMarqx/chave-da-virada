<?php

use App\Models\Concurso;
use App\Models\Disciplina;
use App\Models\Estudo;
use App\Models\Revisao;
use App\Models\RevisaoConfiguracao;
use App\Models\Topico;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('generates weekly reviews on review day', function () {
    $user = User::factory()->create();
    $now = CarbonImmutable::now('America/Fortaleza');

    RevisaoConfiguracao::factory()->create([
        'user_id' => $user->id,
        'ativo' => true,
        'modo' => 'semanal',
        'dia_revisao' => $now->dayOfWeek,
        'timezone' => 'America/Fortaleza',
        'dias_estudo' => 5,
    ]);

    $concurso = Concurso::factory()->create(['user_id' => $user->id]);
    $disciplina = Disciplina::factory()->create([
        'user_id' => $user->id,
        'concurso_id' => $concurso->id,
    ]);
    $topico = Topico::factory()->create([
        'user_id' => $user->id,
        'disciplina_id' => $disciplina->id,
    ]);

    Estudo::factory()->create([
        'user_id' => $user->id,
        'topico_id' => $topico->id,
        'data_estudo' => $now->subDay()->addHours(2),
    ]);

    $this->artisan('revisoes:gerar-semanal')->assertExitCode(0);

    $this->assertDatabaseHas('revisoes', [
        'user_id' => $user->id,
        'topico_id' => $topico->id,
        'status' => 'pendente',
        'tipo' => 'semanal',
        'data_revisao' => $now->startOfDay()->toDateTimeString(),
    ]);

    expect(Revisao::count())->toBe(1);
});
