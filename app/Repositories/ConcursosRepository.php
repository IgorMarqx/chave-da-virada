<?php

namespace App\Repositories;

use App\Models\Concurso;
class ConcursosRepository
{
    public function allWithProgressForUser(int $userId)
    {
        return Concurso::query()
            ->select('concursos.*')
            ->where('concursos.user_id', $userId)
            ->leftJoin('disciplinas', 'disciplinas.concurso_id', '=', 'concursos.id')
            ->leftJoin('topicos', 'topicos.disciplina_id', '=', 'disciplinas.id')
            ->leftJoin('topico_progresso as tp', function ($join) use ($userId) {
                $join->on('tp.topico_id', '=', 'topicos.id')
                    ->where('tp.user_id', '=', $userId);
            })
            ->selectRaw('COALESCE(AVG(COALESCE(tp.mastery_score, 0)), 0) as progresso')
            ->groupBy('concursos.id')
            ->latest('concursos.created_at')
            ->get()
            ->each(function (Concurso $concurso) {
                $concurso->progresso = (float) $concurso->progresso;
            });
    }

    public function create(array $data): Concurso
    {
        return Concurso::query()->create($data);
    }
}
