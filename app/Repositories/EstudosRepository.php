<?php

namespace App\Repositories;

use App\Models\Estudo;
use Illuminate\Support\Facades\DB;

class EstudosRepository
{
    public function listByTopicoForUser(int $topicoId, int $userId)
    {
        return Estudo::query()
            ->where('topico_id', $topicoId)
            ->where('user_id', $userId)
            ->orderByDesc('data_estudo')
            ->get(['id', 'topico_id', 'tempo_segundos', 'data_estudo', 'origem', 'observacao']);
    }

    public function createForUser(int $userId, array $data): Estudo
    {
        return Estudo::query()->create([
            'user_id' => $userId,
            ...$data,
        ]);
    }

    public function upsertTopicoProgresso(int $userId, int $topicoId): void
    {
        $current = DB::table('topico_progresso')
            ->where('user_id', $userId)
            ->where('topico_id', $topicoId)
            ->value('mastery_score');

        $newScore = min(100, ((float) ($current ?? 0)) + 10);

        DB::table('topico_progresso')->updateOrInsert(
            [
                'user_id' => $userId,
                'topico_id' => $topicoId,
            ],
            [
                'mastery_score' => $newScore,
                'ultima_atividade' => now(),
                'proxima_revisao' => now()->addDays(7),
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );
    }
}
