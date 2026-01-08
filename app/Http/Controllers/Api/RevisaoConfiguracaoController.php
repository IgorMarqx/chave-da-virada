<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\RevisaoConfiguracaoRequest;
use App\Models\RevisaoConfiguracao;

class RevisaoConfiguracaoController extends ApiController
{
    public function show()
    {
        $user = request()->user();

        $config = RevisaoConfiguracao::query()->firstOrCreate(
            ['user_id' => $user->id],
            [
                'ativo' => true,
                'modo' => 'semanal',
                'dias_estudo' => 5,
                'dia_revisao' => 6,
                'dias_revisao' => [6],
                'usar_ultima_revisao' => true,
                'janela_estudo_dias' => null,
                'timezone' => null,
            ],
        );

        return $this->apiSuccess($config, 'Configuracao de revisao carregada');
    }

    public function update(RevisaoConfiguracaoRequest $request)
    {
        $user = $request->user();
        $data = $request->validated();

        $config = RevisaoConfiguracao::query()->firstOrCreate(
            ['user_id' => $user->id],
            [
                'ativo' => true,
                'modo' => 'semanal',
                'dias_estudo' => 5,
                'dia_revisao' => 6,
                'dias_revisao' => [6],
                'usar_ultima_revisao' => true,
                'janela_estudo_dias' => null,
                'timezone' => null,
            ],
        );

        if (array_key_exists('dias_revisao', $data) && is_array($data['dias_revisao'])) {
            $sortedDays = array_values(array_unique(array_map('intval', $data['dias_revisao'])));
            sort($sortedDays);
            $data['dias_revisao'] = $sortedDays;
            $data['dia_revisao'] = $sortedDays[0] ?? $config->dia_revisao;
        }

        $config->fill($data);
        $config->save();

        return $this->apiSuccess($config->refresh(), 'Configuracao atualizada com sucesso');
    }
}
