<?php

namespace App\Repositories;

use App\Models\Topico;
use Illuminate\Database\Eloquent\Collection;

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

    public function listByDisciplinaForUser(int $disciplinaId, int $userId): Collection
    {
        return Topico::query()
            ->select('topicos.id', 'topicos.disciplina_id', 'topicos.nome', 'topicos.descricao', 'topicos.ordem')
            ->leftJoin('topico_progresso as tp', function ($join) use ($userId) {
                $join->on('tp.topico_id', '=', 'topicos.id')
                    ->where('tp.user_id', '=', $userId);
            })
            ->where('topicos.disciplina_id', $disciplinaId)
            ->where('topicos.user_id', $userId)
            ->selectRaw('COALESCE(tp.mastery_score, 0) as mastery_score')
            ->selectRaw('tp.proxima_revisao as proxima_revisao')
            ->selectRaw('tp.ultima_atividade')
            ->orderBy('topicos.ordem')
            ->get();
    }

    public function findWithProgressForUser(int $topicoId, int $userId): ?Topico
    {
        return Topico::query()
            ->select('topicos.id', 'topicos.disciplina_id', 'topicos.nome', 'topicos.descricao', 'topicos.ordem')
            ->leftJoin('topico_progresso as tp', function ($join) use ($userId) {
                $join->on('tp.topico_id', '=', 'topicos.id')
                    ->where('tp.user_id', '=', $userId);
            })
            ->where('topicos.id', $topicoId)
            ->where('topicos.user_id', $userId)
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

    public function update(Topico $topico, array $data): Topico
    {
        $topico->fill($data);
        $topico->save();

        return $topico->refresh();
    }

    public function delete(Topico $topico): void
    {
        $topico->delete();
    }

    /**
     * @param  array<int, int>  $topicoIds
     */
    public function reorderForUser(int $disciplinaId, int $userId, array $topicoIds): void
    {
        Topico::query()->getConnection()->transaction(function () use ($disciplinaId, $userId, $topicoIds) {
            foreach ($topicoIds as $index => $topicoId) {
                Topico::query()
                    ->where('id', $topicoId)
                    ->where('disciplina_id', $disciplinaId)
                    ->where('user_id', $userId)
                    ->update(['ordem' => $index + 1]);
            }
        });
    }
}
