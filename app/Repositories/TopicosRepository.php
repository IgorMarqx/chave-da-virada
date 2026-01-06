<?php

namespace App\Repositories;

use App\Models\Topico;
class TopicosRepository
{
    public function create(array $data): Topico
    {
        return Topico::query()->create($data);
    }

    public function getNextOrdemForDisciplina(int $disciplinaId): int
    {
        $lastOrdem = Topico::query()
            ->where('disciplina_id', $disciplinaId)
            ->max('ordem');

        return is_null($lastOrdem) ? 1 : $lastOrdem + 1;
    }

    public function listByDisciplinaForUser(int $disciplinaId, int $userId)
    {
        return Topico::query()
            ->select('topicos.id', 'topicos.disciplina_id', 'topicos.nome', 'topicos.descricao', 'topicos.ordem')
            ->leftJoin('topico_progresso as tp', function ($join) use ($userId) {
                $join->on('tp.topico_id', '=', 'topicos.id')
                    ->where('tp.user_id', '=', $userId);
            })
            ->where('topicos.disciplina_id', $disciplinaId)
            ->selectRaw('COALESCE(tp.mastery_score, 0) as mastery_score')
            ->selectRaw('tp.proxima_revisao as proxima_revisao')
            ->selectRaw("
                CASE
                    WHEN COALESCE(tp.mastery_score, 0) >= 100 THEN 'concluido'
                    WHEN COALESCE(tp.mastery_score, 0) > 0 THEN 'em-andamento'
                    ELSE 'nao-iniciado'
                END as status
            ")
            ->orderBy('topicos.ordem')
            ->get()
            ->each(function (Topico $topico) {
                $topico->mastery_score = (float) $topico->mastery_score;
            });
    }

    public function findWithProgressForUser(int $topicoId, int $userId)
    {
        return Topico::query()
            ->select('topicos.id', 'topicos.disciplina_id', 'topicos.nome', 'topicos.descricao', 'topicos.ordem')
            ->leftJoin('topico_progresso as tp', function ($join) use ($userId) {
                $join->on('tp.topico_id', '=', 'topicos.id')
                    ->where('tp.user_id', '=', $userId);
            })
            ->where('topicos.id', $topicoId)
            ->selectRaw('COALESCE(tp.mastery_score, 0) as mastery_score')
            ->selectRaw('tp.proxima_revisao as proxima_revisao')
            ->selectRaw("
                CASE
                    WHEN COALESCE(tp.mastery_score, 0) >= 100 THEN 'concluido'
                    WHEN COALESCE(tp.mastery_score, 0) > 0 THEN 'em-andamento'
                    ELSE 'nao-iniciado'
                END as status
            ")
            ->first();
    }
}
