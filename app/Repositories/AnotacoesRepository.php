<?php

namespace App\Repositories;

use App\Models\Anotacao;

class AnotacoesRepository
{
    public function findByTopicoForUser(int $topicoId, int $userId): ?Anotacao
    {
        return Anotacao::query()
            ->where('topico_id', $topicoId)
            ->where('user_id', $userId)
            ->first();
    }

    public function upsertForUser(int $userId, array $data): Anotacao
    {
        $anotacao = Anotacao::withTrashed()->updateOrCreate(
            [
                'topico_id' => $data['topico_id'],
                'user_id' => $userId,
            ],
            [
                'titulo' => $data['titulo'] ?? null,
                'conteudo' => $data['conteudo'],
                'deleted_at' => null,
            ],
        );

        return $anotacao;
    }
}
