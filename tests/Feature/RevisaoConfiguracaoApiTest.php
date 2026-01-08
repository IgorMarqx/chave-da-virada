<?php

use App\Models\RevisaoConfiguracao;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('creates default config on first access', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->withoutMiddleware('jwt.auth')
        ->getJson('/api/revisao/configuracao');

    $response->assertSuccessful()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.user_id', $user->id);

    $this->assertDatabaseHas('revisao_configuracoes', [
        'user_id' => $user->id,
        'modo' => 'semanal',
        'ativo' => 1,
    ]);
});

it('updates review configuration', function () {
    $user = User::factory()->create();
    RevisaoConfiguracao::factory()->create(['user_id' => $user->id]);

    $response = $this
        ->actingAs($user)
        ->withoutMiddleware('jwt.auth')
        ->putJson('/api/revisao/configuracao', [
            'modo' => 'semanal',
            'dias_estudo' => 4,
            'dias_revisao' => [2, 5],
            'usar_ultima_revisao' => false,
            'janela_estudo_dias' => 10,
            'timezone' => 'America/Sao_Paulo',
        ]);

    $response->assertSuccessful()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.dias_estudo', 4);

    $response->assertJsonPath('data.dias_revisao.0', 2);

    $this->assertDatabaseHas('revisao_configuracoes', [
        'user_id' => $user->id,
        'dia_revisao' => 2,
        'janela_estudo_dias' => 10,
        'timezone' => 'America/Sao_Paulo',
    ]);
});
