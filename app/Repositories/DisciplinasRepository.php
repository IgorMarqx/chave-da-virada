<?php

namespace App\Repositories;

use App\Models\Disciplina;
use Illuminate\Database\Eloquent\Collection;

class DisciplinasRepository
{
    public function listByConcursoForUser(int $concursoId, int $userId): Collection
    {
        return Disciplina::query()
            ->select('disciplinas.id', 'disciplinas.nome', 'disciplinas.concurso_id')
            ->leftJoin('topicos', 'topicos.disciplina_id', '=', 'disciplinas.id')
            ->leftJoin('topico_progresso as tp', function ($join) use ($userId) {
                $join->on('tp.topico_id', '=', 'topicos.id')
                    ->where('tp.user_id', '=', $userId);
            })
            ->where('disciplinas.concurso_id', $concursoId)
            ->where('disciplinas.user_id', $userId)
            ->selectRaw('COUNT(topicos.id) as topicos')
            ->selectRaw('COALESCE(AVG(COALESCE(tp.mastery_score, 0)), 0) as progresso')
            ->groupBy('disciplinas.id', 'disciplinas.nome', 'disciplinas.concurso_id')
            ->orderBy('disciplinas.nome')
            ->get()
            ->each(function (Disciplina $disciplina) {
                $disciplina->progresso = (float) $disciplina->progresso;
                $disciplina->topicos = (int) $disciplina->topicos;
            });
    }

    public function listRecentForUser(int $userId, int $limit = 3): Collection
    {
        return Disciplina::query()
            ->select('disciplinas.id', 'disciplinas.nome', 'disciplinas.concurso_id')
            ->leftJoin('topicos', 'topicos.disciplina_id', '=', 'disciplinas.id')
            ->leftJoin('topico_progresso as tp', function ($join) use ($userId) {
                $join->on('tp.topico_id', '=', 'topicos.id')
                    ->where('tp.user_id', '=', $userId);
            })
            ->whereNotNull('disciplinas.accessed_at')
            ->where('disciplinas.user_id', $userId)
            ->selectRaw('COUNT(topicos.id) as topicos')
            ->selectRaw('COALESCE(AVG(COALESCE(tp.mastery_score, 0)), 0) as progresso')
            ->groupBy('disciplinas.id', 'disciplinas.nome', 'disciplinas.concurso_id', 'disciplinas.accessed_at')
            ->orderByDesc('disciplinas.accessed_at')
            ->limit($limit)
            ->get()
            ->each(function (Disciplina $disciplina) {
                $disciplina->progresso = (float) $disciplina->progresso;
                $disciplina->topicos = (int) $disciplina->topicos;
            });
    }

    public function create(array $data): Disciplina
    {
        return Disciplina::query()->create($data);
    }

    public function update(Disciplina $disciplina, array $data): Disciplina
    {
        $disciplina->fill($data);
        $disciplina->save();

        return $disciplina->refresh();
    }

    public function delete(Disciplina $disciplina): void
    {
        $disciplina->delete();
    }
}
